import { Component } from 'react';
import PropTypes from 'prop-types';


import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

class CharInfo extends Component {

    state = {
        char: null, //Заменяем пустой объект на null
        loading: false, //так как правая часть макета не должна загружаться, автоматическая загрузка false, будет таботать только по клику пользователя
        error: false//Обработка ошибки
    }

    marvelService = new MarvelService();//Создаем новое свойство внутри класса RandomChar

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps, prevState) { //Этот компонент срабатывает когда к нам приходит новый пропс или изменяется state или есть 
                                                //функция которая вызываем принудительную перерисовку. В качестве аргументов получает предыдущее состояние и предыдущие пропсы
        if (this.props.charId !== prevProps.charId) { //Если новые пришедшие пропсы(id), не равен новым пропсам(id) prevProps.charId, тогда запускаем updateChar()
            this.updateChar();
        }                                             
    }

    // componentDidCatch(err, info) {//Вызывается когда в компоненте произошла ошибка. Принимает 2 аргумента - err это ошибка, а info - инфомрация о компоненте в котором ошибка
    //     console.log(err, info);
    //     this.setState({error: true});
    // }

    updateChar = () => { //Обновление по клику на персонажа данного компонента
        const {charId} = this.props; //Диструктурируем charId
        if (!charId) { //Если нет charId, тогда останавливаем метод
            return;
        }

        this.onCharLoading();// this.onCharLoading; //перед запросом показывается спиннер

        this.marvelService//Если id есть, тогда делаем запрос на сервер
            .getCharacter(charId) //В метод getCharacter передаем charId, далее обрабатываем метод через then и cetch
            .then(this.onCharLoaded) // В onCharLoaded попадает ответ  от сервиса getCharacter, charId попадает в onCharLoaded в касестве аргумента char
            //и запишется в состояние
            .catch(this.onError); //В случае ошибки вызывается onError 
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

    render() {
        const {char, loading, error} = this.state    //Извлекаем сущности из state

        const skeleton = char || loading || error ? null : <Skeleton/>;//Если не загружен персонаж, не загрузка и не ошибка, то тогда отображаем компонент со скелетоном.
        //Если char или loading или error выполняется, то мы ничего не рендерим, иначе помещаем в переменную скелетона
        const errorMessage = error ? <ErrorMessage/> : null; //Спрашиваем есть ли в приложении ошибка? Если да то отображаем компонент с ошибкой
        const spinner = loading ? <Spinner/> : null;//Спрашиваем есть ли загрузка в компоненте? если да, то возвращаем спиннер
        const content = !(loading || error || !char) ? <View char={char}/> : null;//Идет за загрузка или не ошибка или персонаж, тогда показываем char


        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;//вытаскиввем все из объекта char

    //Проверка на отсутствие картинки у персонажа. Если картинки нет, то прописываем доп стили для корректного отображения заглушки
    let imgStyle = {'objectFit' : 'cover'} //Созадем объект который содержит свойство objectFit со значением cover
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') { //если приходит картинка-заглушка, тогда меняем cover на contain
        imgStyle = {'objectFit' : 'contain'} //Далее стиль применяем к изображению
    }
    //////////////////////////////////////

    return (
        <> {/*Используем реакт-фрагмент так как нет родительского элемента*/}
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics with this character'} {/*Если комиксов нет у персонажа, тогда выводим сообщение*/}
                {
                    comics.map((item, i) => { //продохим методом map по массиву с комиксами, где item это комикс а i его номер по порядку
                        if (i > 9) return //Ограничение на вывод количества комиксов на странице при выборе персонажа
                        return ( //возвращаем верстку с фрагментом li
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
                
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    //В свойствах сначала записываем название props который к нам приходит, затем записываем валидацию, то есть то чем оно должно являться
    charId: PropTypes.number //charId обязательно должен быть числом
}

export default CharInfo;