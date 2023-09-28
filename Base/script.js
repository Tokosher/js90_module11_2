
// const foo = async () => {
//     await Promise.reject('Rejected');
//     return 'Ok';
// }

// foo()
//     .then(value => console.log(value))
//     .catch(err => console.error(err))

// const foo = async () => {
//         throw new Error('Whoops!')
//     }
    
//     foo()
//         .then(value => console.log(value))
//         .catch(err => console.console(err))

// const foo = async () => {
//     await Promise.resolve('Resolve');
//     return 'Ok';
// }

// foo()
//     .then(value => console.log(value))
//     .catch(err => console.error(err))

// Example API - https://restcountries.com

// ***************** Конструкція async await ***************** \\

// async function serviceCountry() {
//     const response = await fetch('https://restcountries.com/v3.1/name/deutschland');
    
//     if (!response.ok) {
//         throw new Error(response.statusText)
//     }

//     const data = await response.json();
//     console.log(data)
// }

// serviceCountry()


// ***************** Асинхрона функція завжди поверне проміс ***************** \\


// async function fn() {}

// console.log(fn())




// *****************Асинхронною функціює може бути будь який різновид функції ***************** \\

// ****** Arrow function ****** \\

// const serviceCountry = async () => {
//         const response = await fetch('https://restcountries.com/v3.1/name/deutschland');
    
//     if (!response.ok) {
//         throw new Error(response.statusText)
//     }

//     const data = await response.json();
//     console.log(data)
// }

// serviceCountry()


// ****** Function expression ****** \\

// const serviceCountry = async function () {
//     const response = await fetch('https://restcountries.com/v3.1/name/deutschland');
    
//     if (!response.ok) {
//         throw new Error(response.statusText)
//     }

//     const data = await response.json();
//     console.log(data)
// }

// serviceCountry();


// ****** Object method ****** \\

// const countryInfo = {
//     countryName: 'Ukraine',
//     async serviceCountry () {
//         const response = await fetch(`https://restcountries.com/v3.1/name/${this.countryName}`);
    
//         if (!response.ok) {
//             throw new Error(response.statusText)
//         }
    
//         const data = await response.json();
//         console.log(data)
//     }
// }

// countryInfo.serviceCountry();



// ************ Обробка за допомогою then та catch ************ \\

// async function serviceCountry () {

//             const response = await fetch(`https://restcountries.com/v3.1/name/Ukraine`);
    
//             console.log(response)
//         if (!response.ok) {
//             throw new Error(response.statusText)
//         }
    
//         return response.json();
// }

// serviceCountry()
//     .then(data => {
//         console.log(data)
//     })
//     .catch(err => console.error(err))


// Обробка за допомогою Try catch

// async function serviceCountry() {
//     try {
//         const response = await fetch(`https://restcountries.com/v3.1/name/Ukraine`);
    
//         console.log(response)

//         if (!response.ok) {
//             throw new Error(response.statusText)
//         }

//         const data = await response.json();
//         console.log(data)
//     } catch (e) {
//         console.log(e)
//     }

// }

// serviceCountry();


// try {
//     console.log(abc)

//     fetch (`https://restcountries.com/v3.1/name/Ukraine111`)
//         .then(data => {
//             if (!data.ok) {
//                 throw new Error(data.statusText)
//             }
//             return data.json();
//         })
//         .then(data => {
//             console.log(data)
//         })
//         .catch(err => console.log(err))
// } catch(e) {
//     console.log('Error happens!')
//     console.log(e)
// }


// ********************* Практика ********************* \\
// Створи додаток для туристичного агенства
// Користувач має форму в яку може додавати довільну кількість полів
// В кожне поле він вводить назву країни
// Після сабміту форми форма відправляє запит на бекенд та отримує назви столиць цих країн
// На основі відповіді попереднього сервісу потрібно створити прогноз погоди по кожній столиці
// Використовуй паралельні запити

// Бекенд для пошуку країн https://restcountries.com/
// const BASE_URL = 'https://restcountries.com/v3.1/name/';

// Бекенд для прогнозу погоди  https://www.weatherapi.com/docs/
// const BASE_URL = 'http://api.weatherapi.com/v1';
// const END_POINT = '/current.json'
// const API_KEY = '14c56bddeab14583a6e164909231107'

// Приклад роботи https://ibb.co/6g3YYs8

// Використовуй функцію createMarkup для створення розмітки після деструктуризації всіх данних


// create selectors
const selectors = {
    form: document.querySelector('.js-search'),
    formContainer: document.querySelector('.js-form-container'),
    addField: document.querySelector('.js-add'),
    list: document.querySelector('.js-list'),
};

selectors.addField.addEventListener('click', handlerAdd);
selectors.form.addEventListener('submit', onFormSubmit);


function handlerAdd () {
    selectors.formContainer.insertAdjacentHTML('beforeend', '<input autocomplete="off" type="text" name="country" />')
}

async function onFormSubmit (event) {
    event.preventDefault();
    
    // collect data
    const form = event.currentTarget;
    const formData = new FormData(form);
    const countries = formData.getAll('country');

    const capitals = await serviceCountries(countries);
    const weather = await serviceWeather(capitals);

    selectors.list.innerHTML = createMarkup(weather)

}


async function serviceCountries(countries) {
    const BASE_URL = 'https://restcountries.com/v3.1/name/';

    const responses = await countries.map(async (country) => {
        const response = await fetch(`${BASE_URL}${country}`)
        return response.json();
    }) // [Promises...]

    const data = await Promise.allSettled(responses);
    return data.filter(({ status, value }) => status === 'fulfilled' && Array.isArray(value)).map(({ value }) => value[0].capital[0])
}


async function serviceWeather(capitals) {
    const BASE_URL = 'http://api.weatherapi.com/v1';
    const END_POINT = '/current.json'
    const API_KEY = '14c56bddeab14583a6e164909231107'

    const responses = await capitals.map(async (capital) => {
        const response = await fetch(`${BASE_URL}${END_POINT}?key=${API_KEY}&q=${capital}&lang=uk`)
        return response.json();
    }) // [Promises...]

    const data = await Promise.allSettled(responses);
    // current: temp_c, condition: icon, text
    // location - country, name

    return data.filter(({ status }) => status === 'fulfilled').map(({ value: { current, location } }) => {
        const { temp_c, condition: { icon, text } } = current;
        const { country, name } = location;

        return { temp_c, icon, text, country, name } // name - capital
    })

}



function createMarkup(arr) {
        return arr.map(({ country, name, temp_c, icon, text }) => `
            <li>
                <img src="${icon}" alt="${text}" />
                <h2>${country}</h2>
                <h2>${name}</h2>
                <p>${text}</p>
                <p class="temp">${temp_c} °C</p>
            </li>`).join('')
}