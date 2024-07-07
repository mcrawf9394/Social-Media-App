function createRan () {
    let string = []
    let arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l' ,'m', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v','w', 'x', 'y','z','0','1','2','3','4','5','6','7','8','9']
    for (i = 0; i < 32; i++) {
        let num = Math.floor(Math.random() * 36)
        if (num <= 25) {
            let isCap = Math.floor(Math.random() * 2)
            if (isCap === 1) {
                string.push(arr[num].toUpperCase())
            } else {
                string.push(arr[num])
            }
        } else {
            string.push(arr[num])
        }
    }
    return string.join('')
}
createRan()