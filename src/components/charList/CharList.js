import {Component} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false, //для пагинации
        offset: 1541, //указывается изначальное значение для пагинации(id персонажей)
        charEnded: false //Создаем блокировку кнопки если закончились все персонажи
        
    }

    marvelService = new MarvelService();//Создаем новое свойство внутри класса CharList

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => { //Создаем метод с запросом при клике на кнопку для пагинации. Отвечает за запрос на сервер, вызываем его в первый раз
                              //когда компонент отрендерился без аргумента для того чтобы он ориентировался на _baseOffset
        this.onCharListLoading(); //Метод onCharListLoading переключает состояние newItemLoading в true
        this.marvelService.getAllCharacters(offset)//Передаем отступ
            .then(this.onCharListLoaded) //запускаем onCharListLoaded при получении элементов с сервера, который получает в себя новые данные, формируем новое состояние 
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => { //если запускаем первый раз этот метод, то в charList просто пустой массив

        let ended = false;
        if (newCharList.length < 9) { //определеяем количество элементов(проверка на блокирвоку кнопки когда нет персонажей)
            ended = true; //вычисляем динамически, далее помещаем в state
        }

        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList], //формируем новое состояние после получения новых данных
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended //Помещаем значение переменной ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderItems(arr) { //Метод для оптимизации 
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li className="char__item"
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id); //{/*Благодаря этому каждой карточке устанавливаемся индивидуальное значение*/}
                        this.focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}> 
                    


                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return ( // А эта конструкция вынесена для центровки спиннера/ошибки
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {

        const{charList, loading, error, offset, newItemLoading, charEnded } = this.state;
        const items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}// если charEnded ttue тогда кнопку скрываем, иначе не трогаем
                    onClick={() => this.onRequest(offset)}> {/*Аргумент текущее состояние offset-a*/}
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;