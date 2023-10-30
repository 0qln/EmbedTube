


document.addEventListener("DOMContentLoaded", async function () {
    const frame = document.getElementById('content-frame');
    const options = document.getElementsByClassName('settings-option-button');
    
    // add an link for every button to it's corresponding site
    for (let i = 0; i < options.length; i++) {
        document.getElementById(options[i].id)
        .addEventListener('click', event => {
            const [name] = /.*(?=-btn)/gm.exec(options[i].id);
            frame.src = `${name}/${name}.html`;
        });
    }
});