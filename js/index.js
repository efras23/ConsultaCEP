function isValidCep(inputCEP){
    return /^(\d{2})\.(\d{3})-(\d{3})$/.test(inputCEP.value);
}

function clearFields(){
    document.getElementById("estado").value = "...";
    document.getElementById("cidade").value = "...";
    document.getElementById("bairro").value = "...";
    document.getElementById("endereco").value = "...";
}

function fillFields(data){
    document.getElementById("estado").value = data.estado;
    document.getElementById("cidade").value = data.localidade;
    document.getElementById("bairro").value = data.bairro;
    document.getElementById("endereco").value = data.logradouro;
}

function showFields(){
    const formDivs = document.querySelectorAll("form fieldset div:not(:first-of-type)");
    
    formDivs.forEach(div => {
        div.classList.add("visible");                  // Campo inteiro
    })
}

function animateTextsOfFields(){
    const formDivsInputs = document.querySelectorAll("form fieldset div:not(:first-of-type) input");

    formDivsInputs.forEach(input => {
        input.classList.remove("text-animation");

        input.offsetWidth;                             // Pegar largura do elemento (forçar a remoção da classe)

        input.classList.add("text-animation");
    })
}

document.addEventListener("DOMContentLoaded", function(){

    const inputCEP = document.getElementById("cep");
    let isCEPRequested = false;
    let contRequests = 0;

    // Máscara de CEP (XX.XXX-XXX)
    inputCEP.addEventListener("input", function(){

        if (isCEPRequested) {
            isCEPRequested = false;
            clearFields();
        }

        let cepAtual = inputCEP.value;

        // REGEX
        cepAtual = cepAtual.replace(/\D/g, "");                           // Remover caracteres NÃO numéricos
        cepAtual = cepAtual.replace(/^(\d{2})(\d)/, "$1.$2");             // Adicionar ponto após 2 dígitos
        cepAtual = cepAtual.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2-$3"); // Adicionar hífen após 5 dígitos

        inputCEP.value = cepAtual;

    })
    
    const btn = document.getElementById("consultar");

    // Consultar CEP
    btn.addEventListener("click", async function(event){
    
        event.preventDefault();                                        // Impedir recarregamento da página

        if (isValidCep(inputCEP)){
            const cep = inputCEP.value.replace(/\D/g, "");             // Remover NÃO números

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                if (!response.ok) throw new Error("Erro de comunicação com servidor!");

                const data = await response.json();
                if (data.erro) throw new Error("CEP não encontrado!"); // CEP não existe

                fillFields(data);                                      // PREENCHER FORMULÁRIO!!!

                if (contRequests == 0) {
                    showFields();
                } else {
                    animateTextsOfFields();
                }
                
                isCEPRequested = true;
                contRequests++;
            } catch (e) {
                console.error("Erro: " + e.message)
            }

        }

    })

})