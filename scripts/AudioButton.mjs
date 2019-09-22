AudioButton = function(audioSource, label, id) {
    const btn = {}
    btn.audioSource = audioSource
    btn.label = label
    btn.id = id
    btn.tag = null
    btn.getTag = function() {
        return btn.tag
    }
    btn.setTag = function() {
        btn.tag = document.querySelector(`#btn-${btn.id}`)
    }
    btn.getLabel = function() {
        return btn.label
    }
    btn.getSource = function() {
        return btn.audioSource
    }
    btn.getId = function() {
        return btn.id
    }
    btn.setLabel = function(label) {
        btn.label = label
    }
    btn.setId = function(id) {
        btn.id = id
    }
    return btn
}
export { AudioButton }
