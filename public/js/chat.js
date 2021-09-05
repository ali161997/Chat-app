const socket = io()
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $shareLocationButton = document.querySelector('#share-location')
const $messages = document.querySelector('#messages')

//temps
const meesageTemp = document.querySelector('#message-temp').innerHTML
const locationTemp = document.querySelector('#location-temp').innerHTML
const sidebarTemp = document.querySelector('#sidebar-template').innerHTML
//recieve messages
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
const autoScroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message, 'in on message temp')
    const html = Mustache.render(meesageTemp, {
        username: message.username,
        message: message.message,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})
socket.on('share-location', (location) => {

    const html = Mustache.render(locationTemp, {
        username: location.username,
        message: location.message,
        createdAt: moment(location.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemp, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html

})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    let message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageForm.focus()
        if (error)
            console.log(error)
        else
            console.log('message sent')
    })

})
$shareLocationButton.addEventListener('click', () => {
    $shareLocationButton.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) return alert('your browser cannot access location')
    navigator.geolocation.getCurrentPosition((position) => {
        console.log()
        let coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }
        socket.emit('share-location', coords, (error) => {
            $shareLocationButton.removeAttribute('disabled')
            if (error) {
                return console.log(error)
            }
            console.log('sent')

        })
    })

})
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

