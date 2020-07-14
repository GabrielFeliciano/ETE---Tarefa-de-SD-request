const MarcSelect = $('#car-marc');
const ModelSelect = $('#car-model');
const DateFabricSelect = $('#date-fabric');
"https://parallelum.com.br/fipe/api/v1/carros/marcas/59/modelos/5940/anos/2014-3"
MarcSelect.change(e => {
    DateFabricSelect.empty();
    ModelSelect.empty();
    getModelsAndManufacturingDate(MarcSelect.val());
})

/**
 * Request to FIPE's API easier using only XMLHttpRequest
 * @param {string} link 
 * @param {function} callbackWhenLoaded 
 * @returns {object} [returns the XMLHttpRequest object]
 */
function requester (link, callbackWhenLoaded) {
    const Rq = new XMLHttpRequest();
    Rq.open("GET", link);
    Rq.onload = callbackWhenLoaded.bind(Rq);
    Rq.send();
    return Rq;
}

function getCarBrands () {
    requester ('https://parallelum.com.br/fipe/api/v1/carros/marcas', function () {
        const response = JSON.parse(this.responseText);
        for (let marc of response) {
            const option = $('<option></option>');
            option.text(marc.nome);
            option.attr('value', marc.codigo);
            MarcSelect.append(option);
        }
        getModelsAndManufacturingDate(MarcSelect.val());
    });
}

function getModelsAndManufacturingDate (code) {
    requester (`https://parallelum.com.br/fipe/api/v1/carros/marcas/${code}/modelos`, function () {
        const response = JSON.parse(this.responseText);
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
    })
}

$(document).ready(getCarBrands);

$('#get-price').click(e => {
    const Rq = new XMLHttpRequest();
    const link = `https://parallelum.com.br/fipe/api/v1/carros/marcas/${MarcSelect.val()}/modelos/${ModelSelect.val()}/anos/${DateFabricSelect.val()}`
    console.log(link);
    Rq.open("GET", link);
    Rq.onload = function () {
        try {
            const response = JSON.parse(Rq.responseText);
            $('#price').text(response.Valor);    
        } catch (err) {
            $('#price').text("Preço não encontrado");
        }
    };
    Rq.send();
})