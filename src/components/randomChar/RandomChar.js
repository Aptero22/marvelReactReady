import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends (Component) {

    state = {
        char: {},
        loading: true, //Спиннер
        error: false//Обработка ошибки
    }

    marvelService = new MarvelService();//Создаем новое свойство внутри класса RandomChar

    componentDidMount() {
        this.updateChar();
        // this.timerId = setInterval(this.updateChar, 3000); //Интервал для обновления персонажей
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false})
    }

    onCharLoading = () => { //При запуске метод ставит загрузку в true.Используется между тем когда мы запускаем запросы в работу
        this.setState ({
            loading: true
        })
    }

    onError = () => {//Метод для ошибки
        this.setState({
            loading: false,
            error: true
        })
    } 

    updateChar = () => {//Метод для обращения к серверу и записи данных в state
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000) ;//случайный id.Math.floor() округляет результат до целого. Далее формула для вычисления
        this.onCharLoading(); //Когда запускается обновление персонажа, перед тем как сделать запрос ставим спиннер, то есть loading true
        this.marvelService //вызываем один из методов marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    render() {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null; //Спрашиваем есть ли в приложении ошибка? Если да то отображаем компонент с ошибкой
        const spinner = loading ? <Spinner/> : null;//Спрашиваем есть ли загрузка в компоненте? если да, то возвращаем спиннер
        const content = !(loading || error) ? <View char={char}/> : null;//Если у нас сейчас нет загрузки или нет ошибки, тогда возвращаем компонент
        //<View char={char}/>, иначе ничего

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updateChar} className="button button__main"> {/*Навешиваем событие для того чтобы выдавать случайного персонажа по клику*/}
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => { //Объект со всемми данными об персонажах 
    const {name, description, thumbnail, homepage, wiki} = char;
    //Проверка на отсутствие картинки у персонажа. Если картинки нет, то прописываем доп стили для корректного отображения заглушки
    let imgStyle = {'objectFit' : 'cover'}
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'}
    }
    //////////////////////////////////////

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/> {/*Вставляем переменную для стилей если url картинки заглушка*/}
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;