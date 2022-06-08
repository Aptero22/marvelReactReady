import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMessage";

class ErrorBoundary extends Component { //Компонент для ловли ошибок
    //Ловят ошибки только в методе render, методах жизненного цикла и конструкторах дочерних элементов
    //Не ловят ошибки внутри обработчиков событий, асинхронного кода а также в самом предохранителе, серверном рендеринга
    state = {
        error: false
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({
            error: true
        })
    }

    render() {
        if (this.state.error) { //если находим ошибку, тогда выводим сообщение
            return <ErrorMessage/>
        }

        return this.props.children
    }
}

export default ErrorBoundary;