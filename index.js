document.addEventListener("DOMContentLoaded", function() {
    const valorInicial = document.getElementById("valor-inicial");
    const valorConvertido = document.getElementById("valor-convertido");
    const botoesMoeda = document.querySelectorAll(".moeda");
    const botaoConverter = document.querySelector(".converter");

    let moedaOrigem = "BRL";
    let moedaDestino = "USD";

    // Função para selecionar moeda ao clicar
    botoesMoeda.forEach(botao => {
        botao.addEventListener("click", function() {
            const campo = this.closest(".campo1") ? "campo1" : "campo2";

            if (campo === "campo1") {
                moedaOrigem = converterNomeParaCodigo(this.textContent);
                atualizarSelecao(".campo1 .moeda", this);
            } else {
                moedaDestino = converterNomeParaCodigo(this.textContent);
                atualizarSelecao(".campo2 .moeda", this);
            }

            console.log(`Moeda origem: ${moedaOrigem}, Moeda destino: ${moedaDestino}`);
        });
    });

    // Função para remover seleção dos outros botões e destacar o botão selecionado
    function atualizarSelecao(selector, botaoSelecionado) {
        document.querySelectorAll(selector).forEach(botao => botao.classList.remove("selecionado"));
        botaoSelecionado.classList.add("selecionado");
    }

    // Função para converter nomes das moedas para códigos usados na API
    function converterNomeParaCodigo(nome) {
        const map = {
            "Real": "BRL",
            "Dólar": "USD",
            "Euro": "EUR",
            "Won": "KRW"
        };
        return map[nome] || "BRL"; // Se não encontrar, assume BRL como padrão
    }

    // Função para buscar a cotação na API e converter valores
    async function converterMoeda() {
        const valor = parseFloat(valorInicial.value);
        if (isNaN(valor) || moedaOrigem === moedaDestino) {
            alert("Selecione moedas diferentes e insira um valor válido.");
            return;
        }

        const apiKey = "84dc8b58353c177f141713b6"; // Substitua pela sua chave da API
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${moedaOrigem}`;

        try {
            const resposta = await fetch(url);
            const dados = await resposta.json();

            if (dados.conversion_rates && dados.conversion_rates[moedaDestino]) {
                const taxa = dados.conversion_rates[moedaDestino];
                const resultado = valor * taxa;
                valorConvertido.value = resultado.toFixed(2);
            } else {
                alert("Erro ao obter taxa de câmbio. Tente novamente.");
            }
        } catch (erro) {
            alert("Erro ao conectar com a API.");
            console.error(erro);
        }
    }

    // Chamar a conversão ao clicar no botão
    botaoConverter.addEventListener("click", converterMoeda);
});
