class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/'; //Вынесение повторяющейся строки api для повторого использования
    _apikey = 'apikey=39c4b01e806a8b298b07ddf1e67787aa'; //Вынесение повторяющейся строки api для повторого использования
    _baseOffset = 210; //Создаем базовый отступ, создание пагинации и 

    getResource = async (url) => { //По определенному url запрашиваем данные
        let res = await fetch(url); //Через fetch ждем ответа

        if (!res.ok) { //если происходит ошибка - выводим ошибку в консоль
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json(); //если все ок то получаем ответ, который преобразован в json формат
    }

    getAllCharacters = async (offset = this._baseOffset) => { //запрос на получение всех персонажей
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apikey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => { //запрос на получение одного персонажа 
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apikey}`);
        // return this._transformCharacter(res);
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (char) => { //Принимаем большой объект, а возвращаем только то что нам нужно
        return {
            // name: res.data.results[0].name, //Обращаемся к первому элементу в объекте, пройдя по пути res.data.results
            // description: res.data.results[0].description,
            // thumbnail: res.data.results[0].thumbnail.path + '.' + res.data.results[0].thumbnail.extension, //путь состоит из 2 частей так как в свойтве 2 объекта
            // homepage: res.data.results[0].urls[0].url,
            // wiki: res.data.results[0].urls[1].url
            id: char.id, //id для карточек персонажей, используется на charList.js
            name: char.name, //Обращаемся к первому элементу в объекте, пройдя по пути res.data.results
            description: char.description ? `${char.description.slice(0, 210)}...` : `There is no description for this character`, // через тернарный оператор
            //создаем условие, если у персонажа нет описания тогда выводим надпись,если есть описание то обрезаем его после 210 симола через метод slice()
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension, //путь состоит из 2 частей так как в свойтве 2 объекта
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

}

export default MarvelService; //Экспортируем класс