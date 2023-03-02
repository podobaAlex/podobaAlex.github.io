$(document).ready(() => {

  const smileButton = document.querySelector('.header__smile')
  const cells = document.querySelectorAll('.field__cell')
  const sapper = document.querySelector('.sapper')
  const timers = document.querySelectorAll('.header__timer')
  const minesCounter = document.querySelectorAll('.header__mines_img')

  let mines = 40
  let emptyButtons = cells.length - mines

  let firstClick = true

  installMines(cells)

  checkMines(mines, minesCounter)

  smileButton.addEventListener('click', () => {
    firstClick = true
    mines = 40
    checkMines(mines, minesCounter)

    smileButton.classList.remove('header__smile_sad')
    smileButton.classList.remove('header__smile_cool')

    timers.forEach((value) => {
      value.classList.remove('header__timer_animated')
      value.classList.remove('header__timer_paused')
    })

    sapper.classList.remove('sapper_finished')
    sapper.classList.remove('sapper_timer')

    const classesToRemove = ['field__cell_mine_activate', 'field__cell_mine', 'field__cell_mine_marked'
                            ,'field__cell_marker', 'field__cell_empty', 'field__cell_question', 'field__cell_near_mine'
                            ,'field__cell_one', 'field__cell_two', 'field__cell_three', 'field__cell_four'
                            ,'field__cell_five', 'field__cell_six', 'field__cell_seven', 'field__cell_eight']

    emptyButtons = cells.length - mines

    cells.forEach((value, key) => {
      value.classList.remove(...classesToRemove)
      value.classList.add('field__cell_empty')
    })

    installMines(cells)
  })

  cells.forEach((value, key) => {
    // value.textContent = (i++).toString()

    value.oncontextmenu = () => {

      if (value.classList.contains('field__cell_marker')) {
        checkMines(++mines, minesCounter)
        value.classList.remove('field__cell_marker')
        value.classList.add('field__cell_question')
        return false
      }

      if (value.classList.contains('field__cell_question')) {
        value.classList.remove('field__cell_question')
        load(cells, key)
        return false
      }

      if (!value.classList.contains('field__cell_marker') && value.classList.contains('field__cell_empty')) {
        checkMines(--mines, minesCounter)
        value.classList.add('field__cell_marker')

        if(value.classList.contains('field__cell_mine')) {
          value.classList.add('field__cell_mine_marked')
        }
      }
      return false
    }

    value.addEventListener('mousedown', () => {
      smileButton.classList.add('header__smile_surprise')
    })

    value.addEventListener('mouseup', () => {
      smileButton.classList.remove('header__smile_surprise')
    })

    value.addEventListener('click', () => {
      if(value.classList.contains('field__cell_marker') || value.classList.contains('field__cell_question')) {
        return
      }

      load(cells, key)
    })
  })

  function checkMines(mines, minesCounter) {

    let tens = Math.floor(mines / 10)
    let units = mines % 10

    installNum(minesCounter[1], tens)
    installNum(minesCounter[2], units)

  }

  function installNum(mineCounter, num) {
    switch (num) {
      case 0: mineCounter.setAttribute("style", "left:-126px"); break;
      case 1: mineCounter.setAttribute("style", "left:-0px"); break;
      case 2: mineCounter.setAttribute("style", "left:-14px"); break;
      case 3: mineCounter.setAttribute("style", "left:-28px"); break;
      case 4: mineCounter.setAttribute("style", "left:-42px"); break;
      case 5: mineCounter.setAttribute("style", "left:-56px"); break;
      case 6: mineCounter.setAttribute("style", "left:-70px"); break;
      case 7: mineCounter.setAttribute("style", "left:-84px"); break;
      case 8: mineCounter.setAttribute("style", "left:-98px"); break;
      case 9: mineCounter.setAttribute("style", "left:-112px"); break;
    }
  }

  function load(cells, key) {
    if (firstClick) {
      sapper.classList.add('sapper_timer')

      timers.forEach((value) => {
        value.classList.add('header__timer_animated')
        value.classList.remove('header__timer_paused')
      })

      const reserve = document.querySelector('.reserve')

      if (cells[key].classList.contains('field__cell_mine')) {
        cells[key].classList.remove('field__cell_mine', 'field__cell_mine_marked')
        reserve.classList.add('field__cell_mine')
      }

      reserve.classList.remove('reserve')

      let counter = 0

      for (const element of cells) {
        !element.classList.contains('field__cell_mine') ? counter++ : 0
      }

      cells.forEach((value, key) => {
        if (value.classList.contains('field__cell_mine')) return

        let counter = 0

        if (key % 16 !== 0 && (cells[key - 1]).classList.contains('field__cell_mine')) counter++;
        if (key % 16 !== 15 && (cells[key + 1]).classList.contains('field__cell_mine')) counter++;
        if (Math.floor(key / 16) !== 0 && (cells[key - 16]).classList.contains('field__cell_mine')) counter++;
        if (Math.floor(key / 16) !== 15 && (cells[key + 16]).classList.contains('field__cell_mine')) counter++;
        if (!(key % 16 === 0 || Math.floor(key / 16) === 0) && (cells[key - 17]).classList.contains('field__cell_mine')) counter++;
        if (!(key % 16 === 15 || Math.floor(key / 16) === 15) && (cells[key + 17]).classList.contains('field__cell_mine')) counter++;
        if (!(key % 16 === 15 || Math.floor(key / 16) === 0) && (cells[key - 15]).classList.contains('field__cell_mine')) counter++;
        if (!(key % 16 === 0 || Math.floor(key / 16) === 15) && (cells[key + 15]).classList.contains('field__cell_mine')) counter++;

        if (counter !== 0) {
          value.classList.add('field__cell_near_mine')
          value.classList.add(count(counter))
        }
      })
      firstClick = false
    }

    deepLoad(cells, key)

  }

  function deepLoad(cells, key) {
    if (cells[key].classList.contains('field__cell_empty')) {
      cells[key].classList.remove('field__cell_empty')

      if (cells[key].classList.contains('field__cell_mine')) {
        cells[key].classList.add('field__cell_mine_activate')
        cells[key].classList.remove('field__cell_mine_marked')

        smileButton.classList.add('header__smile_sad')

        cells.forEach((value) => {
          if (value.classList.contains('field__cell_mine')) {
            value.classList.remove('field__cell_empty')
            value.classList.remove('field__cell_marker')
          }
        })

        sapper.classList.add('sapper_finished')
        timers.forEach((value) => value.classList.add('header__timer_paused'))

      }

      if(--emptyButtons === 0) {
        timers.forEach(value => value.classList.add('header__timer_paused'))
        sapper.classList.remove('sapper_timer')
        smileButton.classList.add('header__smile_cool')
        return
      }
      if (!(cells[key].classList.contains('field__cell_near_mine') || cells[key].classList.contains('field__cell_mine'))) {
        setTimeout(function () {
          if (key % 16 !== 0) {
            deepLoad(cells, key - 1)
          }
          if (key % 16 !== 15) {
            deepLoad(cells, key + 1)
          }
          if (Math.floor(key / 16) !== 0) {
            deepLoad(cells, key - 16)
          }
          if (Math.floor(key / 16) !== 15) {
            deepLoad(cells, key + 16)
          }
          if (!(key % 16 === 0 || Math.floor(key / 16) === 0)) {
            deepLoad(cells, key - 17)
          }
          if (!(key % 16 === 15 || Math.floor(key / 16) === 15)) {
            deepLoad(cells, key + 17)
          }
          if (!(key % 16 === 15 || Math.floor(key / 16) === 0)) {
            deepLoad(cells, key - 15)
          }
          if (!(key % 16 === 0 || Math.floor(key / 16) === 15)) {
            deepLoad(cells, key + 15)
          }
        }, 10)

      }
    }
  }

  function installMines(cells) {
    let temp
    let j

    let arr_temp = []

    for(let i = 0; i < cells.length; i++) {
      arr_temp.push(i)
    }

    for (let i = cells.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      temp = arr_temp[j]
      arr_temp[j] = arr_temp[i]
      arr_temp[i] = temp
    }

    for (let i = 0; i < 40; i++) {
      cells[arr_temp[i]].classList.add('field__cell_mine')
    }

    cells[arr_temp[40]].classList.add('reserve')
  }

})

function count(counter) {
  switch (counter) {
    case 1: return 'field__cell_one'
    case 2: return 'field__cell_two'
    case 3: return 'field__cell_three'
    case 4: return 'field__cell_four'
    case 5: return 'field__cell_five'
    case 6: return 'field__cell_six'
    case 7: return 'field__cell_seven'
    case 8: return 'field__cell_eight'
  }
}
