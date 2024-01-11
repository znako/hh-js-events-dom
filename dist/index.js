"use strict";
const takeElement = document.getElementById("takeElement");
const gridContainer = document.getElementById("gridContainer");
const savePositionContainer = document.getElementById("savePositionContainer");
const ELEMENT_SIZE_PX = 100;
const getRandomColor = () => {
    return `rgb(
        ${Math.round(Math.random() * 255)}, 
        ${Math.round(Math.random() * 255)}, 
        ${Math.round(Math.random() * 255)}
    )`;
};
// Вешаем слушатель события "pointerdown" на объект, где будут появлятся элементы
takeElement.addEventListener("pointerdown", (event) => {
    // helper чтоб получать координату центра созданного элемента
    const getPositionCreatedElement = (coordinate) => {
        return coordinate - ELEMENT_SIZE_PX / 2 + "px";
    };
    gridContainer.classList.add("on-drag");
    savePositionContainer.classList.add("on-drag");
    // Создаем элемент, делаем позиционирование абсолютным, чтобы мы могли изменять его положение. Добавляем стилей
    const createdElement = document.createElement("div");
    createdElement.style.position = "absolute";
    createdElement.style.width = `${ELEMENT_SIZE_PX}px`;
    createdElement.style.height = `${ELEMENT_SIZE_PX}px`;
    createdElement.style.backgroundColor = getRandomColor();
    createdElement.style.top = getPositionCreatedElement(event.pageY);
    createdElement.style.left = getPositionCreatedElement(event.pageX);
    createdElement.style.cursor = "grabbing";
    document.body.append(createdElement);
    // Хендлер на событие pointermove, в нем изменяем положение созданного элемента
    const onPointerMoveHandler = (event) => {
        createdElement.style.top = getPositionCreatedElement(event.pageY);
        createdElement.style.left = getPositionCreatedElement(event.pageX);
    };
    // Хендлер на событие pointerup, если отпускаем над каким то контейнером, добавляем в него, если нет, то просто удаляем элемент. В конце очищаем слушатели
    const onPointerUpHandler = (event) => {
        // Хелпер для определения попадания в контейнер
        const isPointerInContainer = (container) => {
            return (event.pageY >=
                window.pageYOffset +
                    container.getBoundingClientRect().top &&
                event.pageY <=
                    window.pageYOffset +
                        container.getBoundingClientRect().bottom &&
                event.pageX >=
                    window.pageXOffset +
                        container.getBoundingClientRect().left &&
                event.pageX <=
                    window.pageXOffset + container.getBoundingClientRect().right);
        };
        if (isPointerInContainer(gridContainer)) {
            // Попали в контейнер grid. Позиционирование меняем на static, чтобы располагался в соответствии с обычным потоком документа. Добавляем в контейнер
            createdElement.style.position = "static";
            gridContainer.append(createdElement);
        }
        else if (isPointerInContainer(savePositionContainer)) {
            // Попали в контейнер с сохранением позиции. Считаем новые top, left уже относительно контейнера. Добавляем в контейнер
            createdElement.style.top =
                Number.parseFloat(createdElement.style.top) -
                    (window.pageYOffset +
                        savePositionContainer.getBoundingClientRect().top) +
                    "px";
            createdElement.style.left =
                Number.parseFloat(createdElement.style.left) -
                    (window.pageXOffset +
                        savePositionContainer.getBoundingClientRect().left) +
                    "px";
            savePositionContainer.append(createdElement);
        }
        else {
            createdElement.remove();
        }
        // Обнуляем стили
        createdElement.style.cursor = "auto";
        gridContainer.classList.remove("on-drag");
        savePositionContainer.classList.remove("on-drag");
        // Очищаем слушатели, больше они нам не нужны
        document.removeEventListener("pointermove", onPointerMoveHandler);
        document.removeEventListener("pointerup", onPointerUpHandler);
    };
    // Добавляем здесь, потому что они нужны только когда начинаем dragNdrop
    document.addEventListener("pointerup", onPointerUpHandler);
    document.addEventListener("pointermove", onPointerMoveHandler);
});
