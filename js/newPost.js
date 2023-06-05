export default function newPostModule(){
    let dataPost = {};
    class CustomSelect {
        static #defaultText = {
            selectItems: "Выберите категории"
        };
        #options;
        #id;
        #selectButton;
        #select;
        #ulContainer;
        #currentSelectedOption;
        #isMulti
    
        constructor( id, options = [], isMulti = false ) {
            this.#selectButton = document.createElement( "button" );
            this.#ulContainer = document.createElement( "ul" );
            this.#select = document.createElement( "select" );
            this.#select.id = id;
            this.#select.style.display = "none";
    
            this.#options = options;
            this.#isMulti = isMulti;
            this.#id = id;
            this.#currentSelectedOption = [];
        }
    
        get selectedValue() {
            return this.#currentSelectedOption;
        }
    
        #renderVisibleSelect( container ) {
            const containerId = `select-dropdown__list--${ this.#id }`;
            this.#ulContainer.className = `select-dropdown__list ${ containerId }`;
    
            this.#options.forEach( ( option ) => {
                const liItem = document.createElement( "li" );
                liItem.className = "select-dropdown__list-item";
                liItem.dataset.value = option.value;
                liItem.innerHTML = option.text;
                liItem.addEventListener(
                    "click",
                    this.#handleDropdownItemSelect.bind( this )
                );
    
                this.#ulContainer.append( liItem );
            } );
    
            if ( container ) {
                container.append( this.#ulContainer );
            }
        }
    
        #renderSelectButton( container ) {
            this.#selectButton.className = `select-dropdown__button select-dropdown__button--${
                this.#id
            }`;
            const buttonTextItem = document.createElement( "input" );
            buttonTextItem.className = `select-dropdown__text select-dropdown__text--${
                this.#id
            }`;
            buttonTextItem.readOnly = true;
            buttonTextItem.placeholder = CustomSelect.#defaultText.selectItems;
            this.#selectButton.append( buttonTextItem );
            container.append( this.#selectButton );
    
            this.#selectButton.addEventListener(
                "click",
                this.#handleDropdownToggle.bind( this )
            );
        }
    
        #handleDropdownToggle() {
            this.#ulContainer.classList.toggle( "active" );
        }
    
        #handleDropdownItemSelect( event ) {
            const { target } = event;
    
            const dataValue = target.getAttribute( "data-value" );
            const targetOption = this.#options.find(
                ( option ) => option.value === Number( dataValue )
            );
            const selectButtonText = this.#selectButton.querySelector(
                ".select-dropdown__text"
            );
    
            if ( selectButtonText && targetOption && dataValue ) {
                this.#currentSelectedOption = this.#isMulti
                    ? [...this.#currentSelectedOption, targetOption]
                    : targetOption;
                const allLiOptions = this.#ulContainer.querySelectorAll(
                    ".select-dropdown__list-item"
                );
                allLiOptions.forEach( ( liOption ) => {
                    liOption.classList.remove( "selected" );
                } );
                target.classList.add( "selected" );
                if ( this.#isMulti ) {
                    selectButtonText.value += `${ targetOption.text },` 
                    dataPost.tegs = this.#currentSelectedOption
                } else {
                    selectButtonText.value = targetOption.text
                    dataPost.category = this.#currentSelectedOption
                }
                console.log(dataPost);
                this.#ulContainer.classList.remove( "active" );
            }
        }
    
        render( container ) {
            const selectDropdownContainer = document.createElement( "div" );
            selectDropdownContainer.className = `select-dropdown select-dropdown--${
                this.#id
            }`;
    
            if ( container ) {
                this.#renderSelectButton( selectDropdownContainer );
                this.#renderVisibleSelect( selectDropdownContainer );
                container.append( selectDropdownContainer );
            }
        }
    }
    
    const tagsOptions = [
        { value: 1, text: "JavaScript" },
        { value: 2, text: "Java" },
        { value: 3, text: "Python" },
        { value: 4, text: "C++" },
        { value: 5, text: "CSS" },
        { value: 6, text: "Frontend" },
        { value: 7, text: "Backend" },
    ];
    const categoriesOptions = [
        { value: 1, text: "JavaScript" },
        { value: 2, text: "Java" },
        { value: 3, text: "Python" },
        { value: 4, text: "C++" },
        { value: 5, text: "CSS" },
        { value: 6, text: "Frontend" },
        { value: 7, text: "Backend" },
    ];
    const tagsSelect = new CustomSelect( "123", tagsOptions, true );
    const categoriesSelect = new CustomSelect( "123", categoriesOptions );
    
    const tagsContainer = document.querySelector( ".select-container.tags" );
    const categoriesContainer = document.querySelector( ".select-container.category" );
    tagsSelect.render( tagsContainer );
    categoriesSelect.render( categoriesContainer );
    const newPost = document.querySelector( `.new-post` )
    const title = newPost.querySelector( '.new-post__title' );
    const text = newPost.querySelector( '.new-post__text' );
    const btnNextSetting = newPost.querySelector( '.new-post__next-setting' );
    const setting = document.querySelector( `.setting` );
    const minText = setting.querySelector(`.setting__min-text`);
    
    function updateBtnState() {
        if ( title.value === '' && text.value === '' ) {
            btnNextSetting.style.cursor = 'no-drop';
        } else {
            btnNextSetting.removeAttribute( 'disabled' );
            btnNextSetting.classList.add( 'submit' );
            btnNextSetting.style.cursor = 'pointer';
        }
    }
    text.addEventListener( 'keyup', updateBtnState );
    
    btnNextSetting.addEventListener( 'click', ( e ) => {
        e.preventDefault();
        dataPost.title = title.value;
        dataPost.subtitle = text.value;
        newPost.style.display = 'none';
        window.scrollBy( 0, 0 )
        setting.style.display = 'flex';
    } );
    
    
    const btnToModerate = document.querySelector(`.to-moderate`);
    setting.addEventListener(`click`, (e) => {
        const checkedLabel = e.target.closest('.checked-label')
        if(checkedLabel){
           dataPost.publick = checkedLabel.textContent;
        }
    })
    btnToModerate.addEventListener(`click`, (e) => {
        e.preventDefault()
        dataPost.mintitle = minText.value;
        console.log(dataPost);
    })
}