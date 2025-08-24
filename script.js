import { Pane } from 'https://cdn.skypack.dev/tweakpane@4.0.4'

const config = {
  theme: 'system',
}

const ctrl = new Pane({
  title: 'Config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'Theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.addBinding(config, 'theme', {
  label: 'Theme',
  options: {
    System: 'system',
    Light: 'light',
    Dark: 'dark',
  },
})

ctrl.on('change', sync)
update()

// -------------------
// GRID INTERACTION
// -------------------
const list = document.querySelector('ul')
const items = list.querySelectorAll('li')
const setIndex = (event) => {
  const closest = event.target.closest('li')
  if (closest) {
    const index = [...items].indexOf(closest)
    const cols = new Array(list.children.length)
      .fill()
      .map((_, i) => {
        items[i].dataset.active = (index === i).toString()
        return index === i ? '10fr' : '1fr'
      })
      .join(' ')
    list.style.setProperty('grid-template-columns', cols)
  }
}
list.addEventListener('focus', setIndex, true)
list.addEventListener('click', setIndex)
list.addEventListener('pointermove', setIndex)
const resync = () => {
  const w = Math.max(
    ...[...items].map((i) => i.offsetWidth)
  )
  list.style.setProperty('--article-width', w)
}
window.addEventListener('resize', resync)
resync()

// -------------------
// IMAGE POPUP FEATURE
// -------------------

// Create popup modal
const modal = document.createElement("div")
modal.id = "imgPopup"
modal.className = "popup"
modal.innerHTML = `
  <span class="close">&times;</span>
  <img class="popup-content" id="popupImg">
`
document.body.appendChild(modal)

const modalImg = modal.querySelector("#popupImg")
const closeBtn = modal.querySelector(".close")

// Open popup on image click
list.querySelectorAll("li article img").forEach(img => {
  img.addEventListener("click", (e) => {
    e.stopPropagation() // prevent triggering grid setIndex
    modal.style.display = "block"
    modalImg.src = img.src
  })
})

// Close modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none"
})
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none"
  }
})
