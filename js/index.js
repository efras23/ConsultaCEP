function isValidCep(inputCEP){
    return /^(\d{2})\.(\d{3})-(\d{3})$/.test(inputCEP.value);
}

document.addEventListener("DOMContentLoaded", function(){

    const queryBtn = document.getElementById("consultar");
    
    // Tornar campos VISÍVEIS
    queryBtn.addEventListener("click", function(event){
        event.preventDefault(); // Impedir página de recarregar

        const formDivs =  document.querySelectorAll("form fieldset div:not(:first-of-type)");
        formDivs.forEach(div => {
            div.classList.add("visible");
        })
    })

    const inputCEP = document.getElementById("cep");

    // Máscara de CEP (XX.XXX-XXX)
    inputCEP.addEventListener("input", function(){
        let cepAtual = inputCEP.value;

        // REGEX
        cepAtual = cepAtual.replace(/\D/g, "");                           // Remove caracteres NÃO numéricos
        cepAtual = cepAtual.replace(/^(\d{2})(\d)/, "$1.$2");             // Adiciona ponto após 2 dígitos
        cepAtual = cepAtual.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2-$3"); // Adiciona hífen após 5 dígitos

        inputCEP.value = cepAtual;
    })
    
    // Consultar CEP
    inputCEP.addEventListener("blur", async function(){
        if (isValidCep(inputCEP)){
            const cep = inputCEP.value.replace(/\D/g, ""); // Remover NÃO números

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                if (!response.ok) throw new Error("Erro de comunicação com servidor!");

                const data = await response.json();
                if (data.erro) throw new Error("CEP não encontrado!"); // CEP não existe!
            } catch (e) {
                console.error("Erro: " + e.message)
            }


        }
    })
})