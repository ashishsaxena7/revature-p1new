const adjust = document.querySelector('#album')

if (adjust){

    fetch('/images')
    .then(res => res.json())
    .then(res => {
        res.forEach(function(iteration) {
            const img = document.createElement('img')
            img.src = iteration

            adjust.appendChild(img)
        })
    })
    
}

const button = document.querySelector('but')

if (button){
    button.addEventListener('click', addPics);
}

function addPics(){
    var image = $('#cool')

    adjust.appendChild(image)
}