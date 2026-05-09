# 🧠 Teachable Machine - Classificação de Imagens

## 📝 Descrição do Projeto
Este projeto consiste no treinamento de uma inteligência artificial para o reconhecimento e classificação supervisionada de imagens. Utilizando a plataforma **Teachable Machine**, o modelo foi ensinado a distinguir categorias específicas de vestuário com base em intensidade cromática, servindo como um estudo de caso prático sobre o ciclo de vida de um modelo de Machine Learning, desde a coleta de dados até a análise crítica de viés.

O objetivo central foi entender como algoritmos aprendem padrões visuais e quais são os limites éticos e técnicos de sistemas que operam com conjuntos de dados restritos.

## 🚀 Diferenciais e Funcionalidades
* **Classificação Binária:** Modelo treinado para diferenciar "camisa clara" de "camisa escura" com alta confiança de predição.
* **Dataset Customizado:** Coleta manual de amostras de imagem (11 para camisas claras e 10 para escuras) para fundamentar o aprendizado.
* **Processamento em Tempo Real:** Interface funcional que utiliza a webcam para realizar predições instantâneas sobre o input visual.
* **Estudo de Viés (Bias):** Identificação de falhas lógicas em casos fora do padrão de treinamento, como roupas estampadas ou variações extremas de iluminação.

## 🛠️ Tecnologias e Parâmetros
* **Plataforma:** [Teachable Machine by Google](https://teachablemachine.withgoogle.com/).
* **Tipo de Aprendizado:** Classificação de Imagens (Supervised Learning).
* **Hiperparâmetros de Treino:**
    * **Epochs:** 50.
    * **Batch Size:** 16.
    * **Learning Rate:** 0.001.

## 📊 Resultados e Análise Crítica
O experimento demonstrou que, embora o modelo atinja alta precisão dentro do ambiente controlado, ele apresenta desafios estruturais importantes.

* **Mecanismo de Viés:** O algoritmo aprende padrões restritos ao conjunto inicial, tratando exceções (como tons intermediários ou roupas pretas e brancas) como erros, o que distorce a lógica do modelo.
* **Consequência Social:** Classificações incorretas em sistemas de larga escala podem reduzir a confiança do usuário e gerar inconsistências operacionais.
* **Mitigação (Human-in-the-loop):** A estratégia proposta envolve a revisão humana de amostras e a ampliação contínua do banco de dados com novas variações para garantir consistência e precisão.

## 🔧 Como Executar
1.  Acesse o link oficial do modelo: [Teachable Machine Project](https://teachablemachine.withgoogle.com/models/LNoICw4p5/).
2.  Permita o acesso à sua webcam no navegador.
3.  Posicione uma peça de roupa (clara ou escura) em frente à câmera para visualizar a predição e a barra de confiança do sistema.

---
**Desenvolvedores:** João Pedro Paulino Cassimiro e Vinicius Paes landim dias.

[Voltar ao início](https://github.com/vpaes053)
