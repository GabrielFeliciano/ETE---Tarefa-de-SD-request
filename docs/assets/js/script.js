const MarcSelect = $('#car-marc');
const ModelSelect = $('#car-model');
const DateFabricSelect = $('#date-fabric');

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
    callbackWhenLoaded ? Rq.onload = function () {
        try {
            callbackWhenLoaded(JSON.parse(Rq.responseText), Rq);
        } catch (err) {
            callbackWhenLoaded(null, Rq);
        }
    } : null;
    Rq.send();
    return Rq;
}

function getCarBrands () {
    requester ('https://parallelum.com.br/fipe/api/v1/carros/marcas', function (response) {
        for (let brand of response) {
            const option = $('<option></option>');
            option.text(brand.nome);
            option.attr('value', brand.codigo);
            MarcSelect.append(option);
        }
        getModelsAndManufacturingDate(MarcSelect.val());
    });
}

function getModelsAndManufacturingDate (code) {
    requester (`https://parallelum.com.br/fipe/api/v1/carros/marcas/${code}/modelos`, function (response) {
        for (let modelObj of response.modelos) {
            const option = $('<option></option>');
            option.text(modelObj.nome);
            option.attr('value', modelObj.codigo);
            ModelSelect.append(option)
        }
        for (let manufacturingDateObj of response.anos) {
            const option = $('<option></option>');
            option.text(manufacturingDateObj.nome);
            option.attr('value', manufacturingDateObj.codigo);
            DateFabricSelect.append(option)
        }
    })
}

$(document).ready(getCarBrands);

$('#get-price').click(e => {
    const linkPart1 = 'https://parallelum.com.br/fipe/api/v1/carros/marcas/';
    const linkPart2 = `${MarcSelect.val()}/modelos/${ModelSelect.val()}/anos/${DateFabricSelect.val()}`;

    const link = linkPart1 + linkPart2;
    
    $('#price-display').empty();
    $('#price-display').text("Procurando preço...");
    console.log(link);
    requester (link, response => {
            if (response) {
                $('#price-display').html(`O preço do carro é de <mark>${response.Valor}</mark>`);
            } else {
                $('#price-display').text("Preço não encontrado");
            }
    })
})