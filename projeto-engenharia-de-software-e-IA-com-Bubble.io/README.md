# 🚀 Bubble.io Cloud Management - Aplicação Web com Governança e Engenharia de Software

## 📝 Descrição do Projeto
Este projeto consiste no desenvolvimento de uma aplicação web de gestão de alta performance utilizando a plataforma **Bubble.io**. O desenvolvimento utilizou a Inteligência Artificial do Bubble como acelerador de prototipagem, mas aplicou rigorosamente os fundamentos tradicionais da **Engenharia de Software** para mitigar riscos de segurança, garantir escalabilidade e estruturar uma governança corporativa sólida.

O sistema foi desenhado para resolver problemas reais de gestão, separando o ciclo de desenvolvimento em planejamento arquitetural fora da plataforma, refatoração de design system e implementação de políticas estritas de proteção de dados.

## 🔗 Link do Projeto Operacional
O protótipo funcional e a interface homologada podem ser acessados através do ambiente de testes oficial:
👉 [Visitar Aplicação no Bubble](https://engenharia-de-prompt.bubbleapps.io/version-test?debug_mode=true)

## 🏗️ Arquitetura e Modelagem de Dados
Seguindo as boas práticas de desenvolvimento, a modelagem foi totalmente planejada de forma prévia (fora do Bubble) para evitar retrabalho e garantir a eficiência do banco de dados:

* **Mapeamento de Entidades (Data Types):** Estruturação lógica e normalizada das tabelas essenciais (como *Usuário*, *Cliente* e *Orçamentos*).
* **Otimização de Relações (1:N):** Para prevenir a degradação de performance, o vínculo entre tabelas foi feito de maneira inversa (ex: um campo apontando para o *Cliente* dentro da tabela *Orçamento*). Foi abolido o uso de "Listas de Dados" em tabelas principais para evitar o estouro do limite recomendado de 100 itens por célula.
* **Option Sets (Prevenção de Hardcode):** Centralização de todos os status do sistema (ex: *Pendente*, *Aprovado*, *Rejeitado*) em conjuntos globais de opções. Isso elimina o uso de strings soltas nas lógicas corporativas, garantindo que chaves de API ou dados confidenciais nunca fiquem expostos.

## 🛡️ Segurança e Privacidade (Privacy by Design)
A aplicação adota o princípio de **Privacy by Design**, tratando a segurança como um pilar nativo e protegendo o ecossistema contra as principais vulnerabilidades listadas no **OWASP Top Ten para LCNC**:

* **Bloqueio de Vazamento de Dados:** Substituição das regras públicas padrão criadas automaticamente pela IA (*Publicly visible*) por políticas restritivas.
* **Regras de Privacidade Estritas:** Implementação da regra corporativa `This Orçamento's Creator is Current User` (Apenas o Criador). Isso garante o isolamento completo de ambientes: um usuário autenticado jamais conseguirá ler, buscar ou interceptar via chamadas de cliente os dados gerados por terceiros, mitigando riscos de exposição acidental.

## ⚡ Desempenho e Otimização de Custos (WUs)
Visando a viabilidade financeira e a sustentabilidade arquitetural do projeto, foram aplicadas travas de consumo de Unidades de Carga de Trabalho (**Workload Units - WUs**):

* **Buscas Otimizadas (Search Efficiency):** Configuração de filtros diretamente nos elementos estruturais do *Repeating Group* (Listas). Evitou-se a execução de buscas (*Do a search for*) aninhadas dentro de células individuais, o que causaria um efeito cascata de consumo de hardware.
* **Definição de Limites na API (max_tokens):** Nas integrações via *API Connector* (como o modelo do ChatGPT para descrições automáticas), foi fixado o parâmetro de tokens máximos para blindar a infraestrutura contra ataques de engenharia social ou prompts maliciosos que visam inflar os custos de computação em nuvem.

## 🎨 Governança, Controle e Engenharia Reversa (Anti-Shadow IT)
Para garantir a manutenibilidade do software e evitar o fenômeno de *Shadow IT*, o projeto incorporou ferramentas visuais de documentação interna:

* **Organização por Código de Cores:** Workflows catalogados visualmente por impacto crítico (ex: **Verde** para rotinas de Sucesso/Navegação e **Vermelho** para ações destrutivas como Exclusão de Dados).
* **Documentação In-Platform:** Inclusão de recursos de *Notes* (Notas) descritivas em cada bloco de automação complexo, transformando o ecossistema No-Code em uma estrutura clara e auditável por qualquer novo engenheiro da equipe.

## 📉 Gestão de Limitações e Estratégia de Saída (Vendor Lock-in)
Como o código-fonte gerado em plataformas proprietárias pertence ao ecossistema do Bubble, estabeleceu-se um plano de contingência e mitigação de dependência tecnológica:
* **Estratégia de Extração:** Configuração e habilitação da **Data API** nativa do Bubble para permitir o mapeamento e extração em massa de todas as tabelas transacionais em formato estruturado JSON.
* **Evolução Tecnológica:** Planejamento arquitetural que permite a migração imediata das tabelas sanitizadas para bancos de dados relacionais e serviços de backend tradicionais desenvolvidos em stacks robustas como **React** (Front-end) e **Node.js** (Back-end), caso o sistema atinja o limite de escalabilidade da plataforma.

---
**Desenvolvedor:** Vinicius Paes Landim Dias  
**Tecnologias Utilizadas:** Bubble.io (Cloud LCNC Engine), Open AI (Prompt Assist), OWASP Privacy Criteria.

[Voltar ao início](https://github.com/vpaes053)
