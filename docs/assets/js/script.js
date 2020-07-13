const MarcSelect = $('#car-marc');
const ModelSelect = $('#car-model');
const DateFabricSelect = $('#date-fabric');
"https://parallelum.com.br/fipe/api/v1/carros/marcas/59/modelos/5940/anos/2014-3"
MarcSelect.change(e => {
    DateFabricSelect.empty();
    ModelSelect.empty();
    getModelsAndDate(MarcSelect.val());
})

function getMarcCars () {
    const Rq = new XMLHttpRequest();
    Rq.open("GET", 'https://parallelum.com.br/fipe/api/v1/carros/marcas');
    Rq.onload = function () {
        const response = JSON.parse(Rq.responseText);
        console.log(response)
        for (let marc of response) {
            const option = $('<option></option>');
            option.text(marc.nome);
            option.attr('value', marc.codigo);
            MarcSelect.append(option)
        }
    };
    Rq.send();
}

function getModelsAndDate (code) {
    const Rq = new XMLHttpRequest();
    Rq.open("GET", `https://parallelum.com.br/fipe/api/v1/carros/marcas/${code}/modelos`);
    Rq.onload = function () {
        const response = JSON.parse(Rq.responseText);
        console.log(response)
        for (let marc of response.modelos) {
            const option = $('<option></option>');
            option.text(marc.nome);
            option.attr('value', marc.codigo);
            ModelSelect.append(option)
        }
        for (let date of response.anos) {
            const option = $('<option></option>');
            option.text(date.nome);
            option.attr('value', date.codigo);
            DateFabricSelect.append(option)
        }
    };
    Rq.send();
}

$(document).ready(function () {
    getMarcCars();
});

$('#get-price').click(e => {
    const Rq = new XMLHttpRequest();
    Rq.open("GET", `https://parallelum.com.br/fipe/api/v1/carros/marcas/${MarcSelect.val()}/modelos/${ModelSelect.val()}/anos/${DateFabricSelect.val()}`);
    Rq.onload = function () {
        const response = JSON.parse(Rq.responseText);
        console.log(response);
        $('#price').text(response.Valor);
    };
    Rq.send();
})