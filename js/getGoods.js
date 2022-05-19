// получение и сохранение данных, 
const getGoods = () => {
  // nodeList элементов с классом ".navigation-link" ( кнопок )
  const links = document.querySelectorAll(".navigation-link")
  // кнопочка "новинки"
  const more = document.querySelector(".more")

  // прорисовка карточек товаров
  const renderGoods = (goods) => {
    const goodsContainer = document.querySelector('.long-goods-list')

    // очистим контейнер 
    goodsContainer.innerHTML = ''

    goods.forEach(good => {
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

    })
  }

  // получение данных с сервера и сохрание их в localStorage 
  // всех или отобранных по заданной категории
  const getData = (value, category) => {
    fetch("./db/db.json")
      .then((res) => res.json())
      .then((data) => {
        const array = category ? data.filter((item) => item[category] === value) : data
        const site = window.location

        localStorage.setItem('goods', JSON.stringify(array))
        // переход на страничку товаров
        //if (window.location.pathname !== '/goods.html') {
        //  window.location.href = '/goods.html'
        if (!site.pathname.includes('goods.html')) {
          site.replace(site.toString().replace(/[^\/]*$/, '') + 'goods.html');
        } else {
          renderGoods(array)
        }

      })
  }

  // подключение действий по нажатию кнопок меню 
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      // здесь, доступны внешние переменные, например, link - кнопка
      event.preventDefault()  // отменить действие браузера по умл.
      // название категории товара (соответствует названию пункта меню)
      const linkValue = link.textContent
      // название поля категории в json для поиска товара, соотв.пункту меню 
      const category = link.dataset.field
      getData(linkValue, category)
    })
  })
  // подключение просмотра новинок на главной странице
  if (more) {
    more.addEventListener('click', (event) => {
      event.preventDefault()
      // по заданию - вывести все (без отбора)
      getData()
    })
  }

  // показ данных последнего посещения
  if (localStorage.getItem('goods') && window.location.pathname === '/goods.html')
    renderGoods(JSON.parse(localStorage.getItem('goods')))
}

getGoods()