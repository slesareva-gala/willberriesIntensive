// поиск
const search = ()=> {
  const input = document.querySelector('.search-block > input')
  const searchBtn = document.querySelector('.search-block > button')


  // прорисовка карточек товаров
  const renderGoods = (goods) => {
    const goodsContainer = document.querySelector('.long-goods-list')

    // очистим контейнер 
    goodsContainer.innerHTML = ''

    goods.forEach( good => {
      // шаблон блока товаров
      const goodBlock = document.createElement('div')
      goodBlock.classList.add('col-lg-3')
      goodBlock.classList.add('col-sm-6')

      goodBlock.innerHTML = `
        <div class="goods-card">
          <span class="label ${good.label ? null : 'd-none'}">${good.label}</span>
          <img src="db/${good.img}" alt="${good.name}" class="goods-image">
          <h3 class="goods-title">${good.name}</h3>
          <p class="goods-description">${good.description}</p>
          <button class="button goods-card-btn add-to-cart" data-id="${good.id}">
            <span class="button-price">$${good.price}</span>
          </button>
        </div>
      `;

      // заполняем контейнер карточками согласно списка
      goodsContainer.append(goodBlock)

    } )
  }

  // получение данных с сервера и сохрание их в localStorage 
  // всех или отобранных по заданной категории
  const getData = ( value ) => {
    fetch("https://goods-9a67e-default-rtdb.firebaseio.com/db.json")
      .then( (res) => res.json() )
      .then( (data) => {
        const array = data.filter( good => good.name.toLowerCase().includes(value.toLowerCase()) )

        localStorage.setItem('goods', JSON.stringify(array)) 
      // переход на страничку товаров
      if ( NOSERV ? 
             !window.location.pathname.includes('/goods.html')  
           : window.location.pathname !== '/goods.html'
         ) {
        window.location.href = '/goods.html' 
      } else {
        renderGoods(array)
      }

      } )
  }


  // действия на нажатие кнопки поиска через подключение с обработчиком ошибок
  try {
    searchBtn.addEventListener('click', ()=>{ getData(input.value) })
  } catch (e) {
    //console.dir(e)   // для выбора, какое свойстово выводить
    console.error("Верните класс search-block !",e.message)   // == .log красным цветом
  }


}
search()