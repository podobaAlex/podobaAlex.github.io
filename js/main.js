$(document).ready(() => {
  let firstClick = true

  let emptyButtons = 256

  let smileButton = document.querySelector('.header__smile')
  let cells = document.querySelectorAll('.field__cell')
  let sapper = document.querySelector('.sapper')
  let timers = document.querySelectorAll('.header__timer')

  smileButton.addEventListener('click', () => {
    firstClick = true

    smileButton.classList.remove('header__smile_sad')
    smileButton.classList.remove('header__smile_cool')

    timers.forEach((value) => value.classList.remove('header__timer_animated'))
    timers.forEach((value) => value.classList.remove('header__timer_paused'))
    sapper.classList.remove('sapper_finished')
    sapper.classList.remove('sapper_timer')

    const classesToRemove = ['field__cell_mine_activate', 'field__cell_mine', 'field__cell_mine_marked'
                            ,'field__cell_marker', 'field__cell_empty', 'field__cell_question', 'field__cell_near_mine'
                            ,'field__cell_one', 'field__cell_two', 'field__cell_three', 'field__cell_four'
                            ,'field__cell_five', 'field__cell_six', 'field__cell_seven', 'field__cell_eight']

    emptyButtons = 256
    cells.forEach((value, key) => {

      value.classList.remove(...classesToRemove)
      value.classList.add('field__cell_empty')

      if (Math.random() < 0.15) {
        emptyButtons--
        value.classList.add('field__cell_mine')
      }
    })
  })

  cells.forEach((value, key) => {
    // value.textContent = (i++).toString()
    if (Math.random() < 0.15) {
      emptyButtons--
      value.classList.add('field__cell_mine')
    }

    value.oncontextmenu = () => {
      if(firstClick) {
        return false
      }
      if (!value.classList.contains('field__cell_marker') && value.classList.contains('field__cell_empty')) {
        value.classList.remove('field__cell_question')
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
      if(value.classList.contains('field__cell_marker')) {
        value.classList.remove('field__cell_marker')
        value.classList.add('field__cell_question')
        return
      }

      value.classList.remove('field__cell_question')
      value.classList.remove('field__cell_mine_marked')

      if (firstClick) {
        sapper.classList.add('sapper_timer')

        timers.forEach((value) => value.classList.add('header__timer_animated'))
        timers.forEach((value) => value.classList.remove('header__timer_paused'))
        value.classList.remove('field__cell_mine')
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
      if (value.classList.contains('field__cell_mine')) {
        value.classList.add('field__cell_mine_activate')
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
      load(cells, key)
    })
  })

  function load(cells, key) {
    if (cells[key].classList.contains('field__cell_empty')) {
      cells[key].classList.remove('field__cell_empty')
      if(--emptyButtons === 0) {
        timers.forEach(value => value.classList.add('header__timer_paused'))
        sapper.classList.remove('sapper_timer')
        smileButton.classList.add('header__smile_cool')
        return
      }
      if (!(cells[key].classList.contains('field__cell_near_mine') || cells[key].classList.contains('field__cell_mine'))) {
        setTimeout(function () {
          if (key % 16 !== 0) {
            load(cells, key - 1)
          }
          if (key % 16 !== 15) {
            load(cells, key + 1)
          }
          if (Math.floor(key / 16) !== 0) {
            load(cells, key - 16)
          }
          if (Math.floor(key / 16) !== 15) {
            load(cells, key + 16)
          }
          if (!(key % 16 === 0 || Math.floor(key / 16) === 0)) {
            load(cells, key - 17)
          }
          if (!(key % 16 === 15 || Math.floor(key / 16) === 15)) {
            load(cells, key + 17)
          }
          if (!(key % 16 === 15 || Math.floor(key / 16) === 0)) {
            load(cells, key - 15)
          }
          if (!(key % 16 === 0 || Math.floor(key / 16) === 15)) {
            load(cells, key + 15)
          }
        }, 10)

      }
    }
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
