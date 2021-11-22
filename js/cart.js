// признак отладки без сервера
const NOSERV = false

// корзина
const cart = ()=> {
  const cartBtn = document.querySelector('.button-cart')
  const cart = document.getElementById('modal-cart')
  const closeBtn = cart.querySelector('.modal-close')
  // контейнер товаров
  const goodsContainer = document.querySelector('.long-goods-list')
  // ссылка на таблицу содержимого корзины
  const cartTable = document.querySelector('.cart-table__goods')
  // ссылка на итого таблицы
  const totalTable = document.querySelector('.card-table__total')
  // ссылка на форму отправки содержимого корзины на сервер 
  const modalForm = document.querySelector('.modal-form')
  // ссылка на имя покупателя и на телефон
  var nameCustomer='', phoneCustomer=''
  document.querySelectorAll('.modal-input').forEach( (el) => {
    if (el.name === 'nameCustomer' ) nameCustomer = el; 
    else if (el.name === 'phoneCustomer' ) phoneCustomer = el;
  })

  // удаление товара из корзины
  const deleteCartItem = ( id ) =>{
    const cart = JSON.parse( localStorage.getItem('cart') )

    const newCart = cart.filter( good => {
      return good.id !== id
    })

    // сохраняем текущее состояние корзины (без удаленного)
    localStorage.setItem('cart', JSON.stringify(newCart))

    // рендерим корзинку
    renderCartGoods( newCart )

  }

  // увеличение количества товара в корзине
  const plusCartItem = ( id ) =>{
    const cart = JSON.parse( localStorage.getItem('cart') )

    const newCart = cart.map( good => {
        if ( good.id === id ) good.count++
        return good
      })

    // сохраняем текущее состояние корзины (без удаленного)
    localStorage.setItem('cart', JSON.stringify(newCart))
    // рендерим корзинку
    renderCartGoods( newCart )
  }

  // уменьшение количества товара в корзине
  const minusCartItem = ( id ) =>{
    const cart = JSON.parse( localStorage.getItem('cart') )

    const newCart = cart.map( good => {
        if ( good.id === id ) {
          if ( good.count > 1 ) good.count--
        }
        return good
      })

    // сохраняем текущее состояние корзины (без удаленного)
    localStorage.setItem('cart', JSON.stringify(newCart))
    // рендерим корзинку
    renderCartGoods( newCart )
  }

  // добавление в корзину
  const addToCart = ( id ) => {
    const goods = JSON.parse( localStorage.getItem('goods') )
    const clickedGood = goods.find( good => good.id === id )
    const cart = localStorage.getItem('cart') ?
      JSON.parse( localStorage.getItem('cart') ) : []

    // товар есть в корзине - увеличиваем его кол-во
    if ( cart.some( good => good.id === clickedGood.id) ) {
      cart.map( good => {
        if ( good.id === clickedGood.id ) good.count++
        return good
      })
    // товара нет в корзине - добавляем
    } else {
      clickedGood.count = 1
      cart.push(clickedGood)
    }

    // сохраняем текущее состояние корзины
    localStorage.setItem('cart', JSON.stringify(cart))

  }

  // рендеринг корзины
  const renderCartGoods = (goods) => {
    // итого в корзине
    let total = 0;

    // очистка предыдущего содержимого корзины
    cartTable.innerHTML = ''

    goods.forEach( good => {
      const tr = document.createElement('tr')
      // сумма итого по строке корзины
      let totalLine = +good.price * +good.count

      // сумма всего в корзине
      total += totalLine

      tr.innerHTML = `
        <td>${good.name}</td>
        <td>${good.price}$</td>
        <td><button class="cart-btn-minus"">-</button></td>
        <td>${good.count}</td>
        <td><button class=" cart-btn-plus"">+</button></td>
        <td>${totalLine}$</td>
        <td><button class="cart-btn-delete"">x</button></td>
      `
      cartTable.append(tr)

      // подключаем слушателя на строку в корзине
      tr.addEventListener('click', (e)=>{

        // уменьшить кол-во -1
        if (e.target.classList.contains('cart-btn-minus') ) {
          minusCartItem( good.id )
        // добавить кол-во +1
        } else if ( e.target.classList.contains('cart-btn-plus') ) {
          plusCartItem( good.id )
        // удалить 
        } else if ( e.target.classList.contains('cart-btn-delete') ) {
          deleteCartItem( good.id )
        }
      })
    })

    // запишем итого
    totalTable.innerHTML = total+'$'

  }

  // отправка на тестовое ip даных корзины
  const sendForm = () => {
    const cartArray = localStorage.getItem('cart') ?
      JSON.parse( localStorage.getItem('cart') ) : []

    nameCustomer.value  = nameCustomer.value.trim();
    phoneCustomer.value = phoneCustomer.value.trim();


    // делаем отправку для заполненной корзины
    if ( cartArray.length && nameCustomer.value && phoneCustomer.value ) {
      fetch('https://jsonplaceholder.typicode.com/posts',{
        method: 'POST',
        body: JSON.stringify({
          cart: cartArray,
          name: nameCustomer.value,
          phone: phoneCustomer.value
        })
      }).then(()=> { 
        // закрываем окошко корзины
        cart.style.display = '' 
        // очистка корзины
        localStorage.removeItem('cart')
        // очистка данных клиента
        nameCustomer.value = ''
        phoneCustomer.value = ''
      })
    }

  }

  // запрос на отправку данных на сервер 
  modalForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    sendForm();
  })


  // переход в корзину
  cartBtn.addEventListener('click', ()=>{
    const cartArray = localStorage.getItem('cart') ?
      JSON.parse( localStorage.getItem('cart') ) : []

    // обновим корзину
    renderCartGoods(cartArray)

    cart.style.display = "flex";
  })

  closeBtn.addEventListener('click', ()=>{
    cart.style.display = ''
  })

  // закрытие модального окна по нажатию мимо него
  cart.addEventListener('click', (e)=>{
    // выбирает первый элемент от текущего, соответствующий селектору, 
    // вверх из дерева DOM
    if ( !event.target.closest('.modal') 
      && event.target.classList.contains('overlay')) {
      cart.style.display = ''
    }
  })

  // закрытие модального окна по Escape
  // окно без фокуса keydown не получит, а так можно закрывать все модальные
  window.addEventListener('keydown', (e)=>{
    if ( e.key == 'Escape') {
      cart.style.display = ''
    }
  })


  // подключение просмотра новинок на главной странице
  if ( goodsContainer) {
    goodsContainer.addEventListener('click', (event)=>{
      //event.preventDefault()
      // ссылка на кнопку в корзину, если не нажали равна null
      const buttonToCart = event.target.closest('.add-to-cart')
      // нажали на кнопку в корзину
      if ( buttonToCart ) {
        const goodId = buttonToCart.dataset.id
        addToCart( goodId ) // добавляем в корзину

      }
    } )
  }


}
cart()