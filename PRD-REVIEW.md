
# PRD-REVIEW — Smart To-Do List com IA

Este documento reúne os problemas identificados na análise do PRD v1.2 do produto Smart To-D. Os itens foram organizados por requisito funcional e cobrem ambiguidades, requisitos ausentes, critérios de aceitação incompletos, riscos técnicos e de segurança identificados nas lacunas do documento.

**Autor:** Luidson Lucas Bortolatto

**Data da elaboração:** 25 abr 2026

## [PRD-001] Ausência de requisitos sobre paginação

**Requisito afetado:** RF-01

**Categoria:** Requisito ausente

**Problema identificado**

Uma das personas, Lucas tem pouca paciência para lentidão e gerencia múltiplos projetos simultâneos. Porém no requisito não é descrito nada sobre paginação. Dependendo da quantidade de tarefas, conexão de internet ou até memória do equipamento usado, podemos ter problemas como demora no carregamento, ou travamento da aplicação.

**Por que isso é um risco**

O desenvolvedor pode tanto assumir que deve ter uma paginação ou pode assumir que não deve ter a paginação porque não está descrito. Podemos chegar com a aplicação para o cliente sem uma paginação. ou durante o desenvolvimento pode haver a discussao sa paginação será feita pelo backend, direto no frontend e quantos itens deve ser enviados. Parando o desenvolvimento para se discutir algo que poderia ser definido nos requisitos. Além disso, teria o risco do backend retornar toda a lista de tarefas sem limite de paginação, ocasionando um problema de performance

**Sugestão de melhoria**

Adicionaria o requisito de paginação (seja no front ou no backend) e a quantidade de itens esperados por página.

---

## [PRD-002] Ausência de detalhes sobre o que seria o elemento visual de diferenciação

**Requisito afetado:** RF-01

**Categoria:** Requisito ausente

**Problema identificado**

Não especifica qual seria essa diferenciação: Se iria mostrar o status em texto ou algum elemento visual (como um check, por exemplo)

**Por que isso é um risco**

O desenvolvedor pode implementar de uma forma diferente do que o designer pensou gerando retrabalho

**Sugestão de melhoria**

Adicionaria o requisito informando qual seria a diferenciação visual (um ícone de check, mostrar a tarefa como attached, ou outra forma)

---

## [PRD-003] Ausência de clareza sobre o que seria "Quando aplicável"

**Requisito afetado:** RF-01

**Categoria:** Ambiguidade

**Problema identificado**

O requisito diz: "Indicação de que a tarefa foi gerada por IA, quando aplicável". Não ficou claro o que seria o aplicável nesse contexto. Ao meu ver só temos 2 opções ou a tarefa foi escrita por IA ou não, então não está claro.

**Por que isso é um risco**

Ficar confuso no desenvolvimento sobre quando mostrar e como mostrar a indicação

**Sugestão de melhoria**

Alteraria esse requisito indicando para ser mostrada Sim ou não ou uma tag "IA" apenas quando ela for gerada por IA, ou ainda ter uma tag "IA" x "MANUAL", por exemplo

---

## [PRD-004] Ausência de comportamento para lista vazia

**Requisito afetado:** RF-01

**Categoria:** Critério de aceitação incompleto

**Problema identificado**

O requisito não descreve o que deve ser exibido quando o usuário não tem nenhuma tarefa cadastrada.

**Por que isso é um risco**

Sem essa definição, o desenvolvedor pode deixar a tela em branco, exibir uma mensagem genérica de erro podendo gerar uma experiência ruim para novos usuários

**Sugestão de melhoria**

Adicionar um requisito quando não há tarefas: Uma mensagem como "Não há tarefas" ou "Vamos colocar seu plano em açao?" pra incentivar os usuários a entrarem em ação

---

## [PRD-005] Faltam requisitos no campo de título de tarefa

**Requisito afetado:** RF-02

**Categoria:** Requisito ausente

**Problema identificado**

Não há requisito sobre tamanho do campo, tipos de caracteres aceitos e obrigatoriedade do campo

**Por que isso é um risco**

Dependendo da interpretação do desenvolvedor, o campo pode ficar com menos caracteres do que o cliente deseja, ou estar como opcional ao invés de ser obrigatório. Pensando em 2 personas que trabalham com diferentes projetos e tarefas e criam tarefas baseados em idéias ou briefs/reuniões, ter um campo limitado pra escrever o título, ou não conseguir colocar algum caractere que gostariam pode ser um pouco frustante. Ou ainda, a persona Marina que usa mais no celular pode ter uma experiência ruim caso o nome da tarefa seja muito longo.

**Sugestão de melhoria**

Definir tamanho mínimo e máximo do campo, caracteres aceitos e obrigatoriedade.

---

## [PRD-006] Ausência de uma descrição da tarefa

**Requisito afetado:** RF-02

**Categoria:** Requisito ausente

**Problema identificado**

Algumas tarefas precisam de mais detalhes ou algum contexto. Ainda mais para a persona Lucas que transforma reuniões e briefs em tarefas. O nome ajuda a lembrar rapidamente o que é a tarefa, enquanto a descrições dá detalhes importantes e necessários para a execução da tarefa

**Por que isso é um risco**

Título ficar muito grande e não couber todo o texto necessário para a execução da tarefa.

**Sugestão de melhoria**

Ter 2 campos: O Título e a descrição. Título com menos caracteres e descrição permitindo colar textos maiores.

---

## [PRD-007] Detalhamento do fluxo após a adição da tarefa

**Requisito afetado:** RF-02

**Categoria:** Requisito ausente

**Problema identificado**

Após a adição da tarefa, o requisito diz que a tarefa deve aparecer na lista imediatamente, mas não diz se o formulário de criação de tarefa vai ficar aberto ou terá uma opção pro usuário adicionar mais tarefas

**Por que isso é um risco**

Os usuários podem estar adicionando várias tarefas. Nesse caso, se o desenvolvedor implementar um fluxo que fecha a tela de adição de tarefas, us usuários terão que toda vez ter que clicar no botão de adicionar tarefa após a criação da mesma

**Sugestão de melhoria**

Adicionar uma mensagem de confirmação que a tarefa foi criada, e uma pergunta: "Deseja criar uma nova tarefa?" com o botão Sim/Não. Assim caso ele queira é so clicar no botão

---

## [PRD-008] Adição múltipla de tarefas

**Requisito afetado:** RF-02

**Categoria:** Requisito ausente

**Problema identificado**

Não há nenhum requisito sobre adição de múltiplas tarefas

**Por que isso é um risco**

A persona Lucas, por exemplo tranforma reuniões/briefs em tarefas. Normalmente saímos de reuniões com uma lista de itens. Ter que adicionar eles manualmente poderia ser cansativo

**Sugestão de melhoria**

Ter a opção de adição múltipla parecido com o app TODO Ist. Quando adicionamos uma lista de item ele criar uma tarefa pra cada item, evitando ter que copiar um por um.

---

## [PRD-009] Não há comportamento mapeado caso houver algum erro na criação da tarefa

**Requisito afetado:** RF-02

**Categoria:** Critério de aceitação incompleto

**Problema identificado**

O critério de aceite diz que "O campo de título é limpo após a criação bem-sucedida", porém não diz o que ocorre caso aconteça um erro.

**Por que isso é um risco**

Desenvolvedor pode implementar o fluxo com caminho feliz, e quando houver um erro não ter nenhum feedback pro usuário e ele desistir da plataforma

**Sugestão de melhoria**

Adicionar o requisito de que caso ocorra algum erro, ter o feedback pro usuário com uma mensagem amigável e uma ação que ele pode fazer (tentar novamente, reportar, etc)

---

## [PRD-010] Ausência de requisito indicando um loading na tela durante o salvamento

**Requisito afetado:** RF-02

**Categoria:** Critério de aceitação incompleto

**Problema identificado**

Não há requisito indicando a adição de um spinner ou mensagem pro usuário caso a adição da tarefa estiver demorando mais que o esperado

**Por que isso é um risco**

Embora uma aplicação de tarefas não seja tão pesada a ponto de demorar muito tempo pra realizar a adição da tarefa, como nossas personas tem baixa tolerância de erros e lentidão, uma falta de feedback durante esse processo pode desincentivar o uso da aplicação, principalmente para a persona Marina que tem baixa tolerância para erros silenciosos

**Sugestão de melhoria**

Adicionar o requisito de um loading ou mensagem durante o processo de salvar no backend.

---

## [PRD-011] Não há requisitos para desfazer conclusão acidental de tarefas

**Requisito afetado:** RF-03

**Categoria:** Requisito ausente

**Problema identificado**

Pensando nas personas que gerenciam múltiplos projetos ou lidam com muitas frentes em paralelo, erros podem ocorrer. O requisito descreve apenas a ação de marcar uma tarefa como concluída, mas não menciona se o usuário pode reverter essa ação. Não ter a opção de desfazer uma conclusão de tarefa pode ser um problema

**Por que isso é um risco**

Caso um usuário conclua uma tarefa de maneira errada e não tiver uma forma de desfazer a ação ele teria que criar novamente a tarefa, podendo derrubar o engajamento com a ferramenta.

**Sugestão de melhoria**

Adicionar um requisito simples de: Ao clicar no checkbox, tarefa concluída, ao clicar novamente ele desfaz a conclusão da tarefa (toggle)

---

## [PRD-012] Ausência de definição do feedback visual ao concluir tarefa

**Requisito afetado:** RF-03

**Categoria:** Ambiguidade

**Problema identificado**

O requisito diz que "a tarefa deve exibir feedback visual ao ser marcada como concluída", mas não especifica qual é esse feedback. Uma linha cortada no título, cor mais clara, ícone de check preenchido, etc.

**Por que isso é um risco**

Desenvolvedor e designer podem pensar em soluções diferentes sem alinhamento prévio, gerando retrabalho.

**Sugestão de melhoria**

Definir o elemento visual utilizado para indicar conclusão, por exemplo: Um título com linha cortada e/ou texto com cor mais clara.

---

## [PRD-013] Ausência de comportamento em caso de falha na persistência do estado

**Requisito afetado:** RF-03

**Categoria:** Critério de aceitação incompleto

**Problema identificado**

O critério de aceitação diz que "a mudança de estado persiste", mas não define o comportamento caso a chamada ao backend falhe. O usuário pode ver o checkbox marcado no frontend enquanto a informação não foi salva.

**Por que isso é um risco**

O usuário acredita que a tarefa foi concluída, mas ao recarregar a página o estado volta para pendente. Para a persona Marina, que tem baixa tolerância para erros silenciosos, esse tipo de comportamento pode fazer com que ela abandone a plataforma.

**Sugestão de melhoria**

Adicionar critério de aceite para o caso de falha. Exemplo: Reverter a alteração visual anterior e exibir mensagem de erro informando que não foi possível salvar a alteração.

---

## [PRD-014] Ausência de confirmação antes da exclusão da tarefa

**Requisito afetado:** RF-04

**Categoria:** Ambiguidade

**Problema identificado**

O requisito não define se deve haver uma confirmação antes de excluir a tarefa. Não fica claro se ao clicar no botão de exclusão a tarefa é removida imediatamente ou se o usuário recebe uma mensagem pedindo confirmação da ação.

**Por que isso é um risco**

A exclusão é uma ação irreversível. Sem uma confirmação, um clique acidental remove a tarefa permanentemente e o usuário precisaria criá-la novamente. Para as personas que gerenciam múltiplos projetos e lidam com alto volume de tarefas, isso pode ser frustrante e derrubar o engajamento com a ferramenta.

**Sugestão de melhoria**

Definir no requisito uma etapa de confirmação antes da exclusão. Por exemplo: exibir uma mensagem "Tem certeza que deseja excluir esta tarefa?" com as opções Confirmar e Cancelar.

---

## [PRD-015] Ausência de feedback visual após a exclusão da tarefa

**Requisito afetado:** RF-04

**Categoria:** Critério de aceitação incompleto

**Problema identificado**

O critério de aceitação diz apenas que a tarefa não aparece mais na lista após a exclusão, mas não define nenhum feedback pro usuário confirmando que a ação foi realizada com sucesso.

**Por que isso é um risco**

Sem feedback, o usuário pode ficar em dúvida se a exclusão aconteceu de fato, principalmente se a lista tiver muitos itens e ele não perceber visualmente que foi removido

**Sugestão de melhoria**

Adicionar um requisito de feedback após a exclusão, como uma mensagem temporária "Tarefa excluída com sucesso" que some após alguns segundos.

---

## [PRD-016] Ausência de comportamento em caso de erro na exclusão

**Requisito afetado:** RF-04

**Categoria:** Critério de aceitação incompleto

**Problema identificado**

O critério de aceite cobre apenas o caminho feliz, sem definir o que acontece caso a exclusão falhe. O usuário pode clicar no botão, a tarefa sumir visualmente e depois reaparecer ao recarregar a página.

**Por que isso é um risco**

Para a persona Marina, que tem baixa tolerância para erros silenciosos, ver uma tarefa reaparecer depois de tê-la excluído pode gerar desconfiança na ferramenta e levar ao abandono da plataforma.

**Sugestão de melhoria**

Adicionar critério de aceite para o caso de falha. Exemplo: Manter a tarefa na lista e exibir uma mensagem de erro informando que não foi possível concluir a exclusão, com a opção de tentar novamente ou reportar erro.

---

## [PRD-017] Ausência de etapa de revisão antes de salvar as tarefas geradas pela IA

**Requisito afetado:** RF-05

**Categoria:** Requisito ausente

**Problema identificado**

O requisito define que as subtarefas geradas pela IA são salvas automaticamente na lista, mas não há nenhuma etapa de revisão ou confirmação antes disso. O usuário não tem a chance de ajustar, remover ou refinar o que a IA sugeriu antes de salvar.

**Por que isso é um risco**

A IA pode gerar tarefas que não fazem sentido pro usuário, ou sugerir um número excessivo de subtarefas. Sem uma etapa de revisão, todas elas vão direto pra lista e o usuário teria que excluir uma por uma manualmente (já que o editar está fora de escopo nessa versão). Para as personas que lidam com muitas frentes ou projetos, isso pode ser frustrante.

**Sugestão de melhoria**

Adicionar uma etapa de preview antes de salvar: exibir as tarefas geradas com a opção de remover individualmente ou confirmar todas de uma vez antes de salvar na lista ou ter uma confirmação via prompt antes de transformar em tarefas.

---

## [PRD-018] Ausência de comportamento em caso de erro na comunicação com a IA

**Requisito afetado:** RF-05

**Categoria:** Critério de aceitação incompleto

**Problema identificado**

Os critérios de aceitação cobrem apenas o caminho feliz: o indicador de carregamento aparece e as tarefas são geradas. Não há nenhuma definição do que acontece se a chamada à IA falhar, timeout ou retornar um erro.

**Por que isso é um risco**

Sem feedback de erro, o usuário fica olhando para um loading eterno. Para a persona Marina, que tem baixa tolerância para erros silenciosos, esse tipo de comportamento pode fazer com que ela abandone a plataforma.

**Sugestão de melhoria**

Adicionar critério de aceite para falha: encerrar o loading e exibir uma mensagem de erro com a opção de tentar novamente, como "Não foi possível gerar as tarefas. Tente novamente."

---

## [PRD-019] Falta de clareza sobre como as tarefas geradas pela IA são adicionadas à lista

**Requisito afetado:** RF-05

**Categoria:** Ambiguidade

**Problema identificado**

O requisito diz que as subtarefas são "salvas automaticamente na lista do usuário", mas não especifica como isso acontece quando já existem tarefas cadastradas. As tarefas geradas são adicionadas ao final da lista? No início? Substituem as existentes?

**Por que isso é um risco**

Como a IA pode gerar múltiplas tarefas de uma vez, o desenvolvedor pode tomar essa decisão sozinho. Dependendo da implementação, as novas tarefas podem aparecer em locais inesperados na lista, confundindo o usuário.

**Sugestão de melhoria**

Definir onde as tarefas geradas por IA aparecem na lista após a geração. Por exemplo: Adicionadas ao final ou no início.

---

## [PRD-020] Ausência de validação da resposta da IA antes de salvar

**Requisito afetado:** RF-05

**Categoria:** Risco técnico

**Problema identificado**

O requisito diz que o sistema deve "processar a resposta recebida e extrair as subtarefas sugeridas", mas não define nenhum critério de validação do que foi extraído. Não há definição se o sistema verifica se a resposta faz sentido, se está no formato esperado ou se a IA alucionou.

**Por que isso é um risco**

IAs podem retornar respostas fora do formato esperado, incompletas ou com algum outro problema. Sem a validação, o sistema pode tentar salvar uma resposta fora do padrão ou incompleta, causando erros no backend ou criando tarefas com títulos inválidos ou incompletos na lista de tarefas

**Sugestão de melhoria**

Definir um critério mínimo de validação da resposta da IA antes de salvar. Exemplo: Verificar se pelo menos uma subtarefa foi extraída, se os títulos não estão vazios e se o formato está dentro do esperado.

---

## [PRD-021] Ausência de limite de caracteres no campo de objetivo

**Requisito afetado:** RF-05

**Categoria:** Requisito ausente

**Problema identificado**

O campo de texto onde o usuário descreve o objetivo não tem limite de caracteres definido no requisito.

**Por que isso é um risco**

Um objetivo muito longo pode causar erros na chamada à IA ou um processamento incompleto.

**Sugestão de melhoria**

Definir um limite máximo de caracteres no campo, por exemplo 500 ou 1000 caracteres e adicionar um contador de caracteres visível pro usuário saber quanto ainda pode digitar.

---

## [PRD-022] Ausência de comportamento quando a IA retorna zero tarefas

**Requisito afetado:** RF-05

**Categoria:** Critério de aceitação incompleto

**Problema identificado**

O critério de aceite diz que "as tarefas geradas aparecem na lista ao final do processamento", mas não define o que acontece se a IA processar o objetivo e não extrair nenhuma subtarefa. Isso pode acontecer com objetivos muito vagos ou algum problema no processamento

**Por que isso é um risco**

O usuário aguarda o processamento, o loading some e nada aparece na lista. Sem uma mensagem, ele não sabe se a geração falhou, e qual pode ser o problema

**Sugestão de melhoria**

Adicionar critério de aceitação para resultado vazio. Exemplo: Exibir uma mensagem informando que nenhuma tarefa foi identificada e sugerindo que o usuário revise o objetivo e envie novamente.

---

## [PRD-023] Ausência de validação da API Key inserida

**Requisito afetado:** RF-06

**Categoria:** Critério de aceitação incompleto

**Problema identificado**

O critério de aceite diz que "a funcionalidade de geração por IA fica disponível após a inserção da chave", mas não define se a chave é validada antes de liberar a funcionalidade.

**Por que isso é um risco**

Sem uma validação e feedback, o usuário só vai descobrir que a chave está errada na hora de tentar gerar tarefas, quando receber um erro da IA.

**Sugestão de melhoria**

Adicionar um critério de aceite de validação da chave antes de liberar a funcionalidade. Por exemplo: ao inserir a chave, o sistema faz uma chamada de teste ao provedor e exibe um feedback de sucesso ou erro informando se a chave é válida.

---

## [PRD-024] Ausência de mascaramento do campo de API Key

**Requisito afetado:** RF-06

**Categoria:** Segurança

**Problema identificado**

O requisito define que a interface deve disponibilizar um campo para inserção da chave, mas não especifica que o campo deve mascarar os caracteres após a inserção, como acontece em campos de senha.

**Por que isso é um risco**

A API Key fica visível na tela para qualquer pessoa que esteja perto do usuário ou que acesse um print ou gravação de tela. Isso é um risco de segurança especialmente para a persona Lucas, que usa a aplicação no ambiente de trabalho e pode ter a chave exposta durante reuniões.

**Sugestão de melhoria**

Definir que o campo de API Key deve mascarar os caracteres após a inserção, com a opção de revelar temporariamente, igual ao comportamento padrão de campos de senha.

---

## [PRD-025] Ausência de requisitos sobre armazenamento e criptografia da API Key

**Requisito afetado:** RF-06

**Categoria:** Segurança

**Problema identificado**

O requisito não define onde e como a API Key deve ser armazenada. Não há nenhuma menção sobre criptografia ou proteção da chave.

**Por que isso é um risco**

Se a chave for armazenada em texto puro no banco de dados ou exposta em logs, qualquer acesso indevido ao sistema pode comprometer a chave do usuário. Uma chave vazada pode gerar cobranças indevidas ou acesso não autorizado à conta do usuário.

**Sugestão de melhoria**

Adicionar requisito de segurança definindo que a API Key deve ser armazenada de forma criptografada e nunca exposta em logs ou respostas da API. Definir também se o armazenamento é no frontend ou no backend, e os cuidados de segurança para ambos.

---

## [PRD-026] Ausência de definição sobre persistência da API Key entre sessões

**Requisito afetado:** RF-06

**Categoria:** Requisito ausente

**Problema identificado**

O requisito não define se a API Key persiste entre sessões ou se o usuário precisa inserir novamente toda vez que acessar a aplicação.

**Por que isso é um risco**

Se a chave não persistir, o usuário terá que inserir a chave toda vez que acessar a aplicação, o que é frustrante e pode fazer com que ele desista de usar a feature de IA.

**Sugestão de melhoria**

Definir se a chave persiste entre sessões e por quanto tempo. Por exemplo: a chave persiste no navegador até o usuário removê-la manualmente, com uma opção visível de remoção na interface.

---

## [PRD-027] Ausência de feedback quando a API Key não está configurada

**Requisito afetado:** RF-06

**Categoria:** Critério de aceitação incompleto

**Problema identificado**

O critério de aceitação define o que acontece após a inserção da chave, mas não define o que o usuário vê antes de configurar a chave. Não fica claro se o campo de geração por IA aparece desabilitado, fica oculto ou aparece normalmente.

**Por que isso é um risco**

Um novo usuário que ainda não configurou a chave pode tentar usar a feature de geração por IA e receber um erro sem entender o motivo. Isso pode aumentar a desistência de uso da plataforma nos primeiros uso que é justamente o problema que o produto quer resolver.

**Sugestão de melhoria**

Adicionar critério de aceitação para quando a chave não esta configurada. Exemplo: Exibir o campo de geração por IA desabilitado e com uma mensagem informando que para funcionar é necessário configurar a API Key.

---

## [PRD-028] Ausência de definição do que seria "utilizável" no requisito de responsividade

**Requisito afetado:** RNF

**Categoria:** Ambiguidade

**Problema identificado**

O requisito diz que o layout deve ser "utilizável em telas a partir de 375px de largura", mas não define o que seria utilizável. Não fica claro se todos os elementos devem ser visíveis e funcionais, se pode haver scroll horizontal, se algum elemento pode ser ocultado em telas menores, etc.

**Por que isso é um risco**

Cada desenvolvedor vai interpretar "utilizável" de uma forma diferente. Um pode considerar utilizável uma tela onde o botão de exclusão some em mobile, outro pode considerar aceitável um texto cortado.

**Sugestão de melhoria**

Substituir "utilizável" por critérios mais objetivos. Exemplo: Todos os elementos interativos devem ser acessíveis e funcionais em telas a partir de 375px, sem sobreposição de elementos.

---

## [PRD-029] Ausência de critérios de medição e processo para a disponibilidade de 99%

**Requisito afetado:** RNF

**Categoria:** Ambiguidade

**Problema identificado**

O requisito define que o backend deve estar disponível 99% do tempo, mas não define como essa disponibilidade será medida, qual ferramenta será usada para monitorar, o tempo de manutenção programada, como vai ser feito os calculos de desconto de tempo de manutenção e onde será exibido o status de disponibilidade.

**Por que isso é um risco**

Pode haver conflitos com os stakeholders ou usuários sobre tempo de manutenção, exibição de dados, além de ficar um pouco vago dizer 99% do tempo excluindo a manutenção.

**Sugestão de melhoria**

Definir a ferramenta de monitoramento, o período de medição (mensal, anual), como as janelas de manutenção programada serão comunicadas com antecedência e descontadas do cálculo.

---

## [PRD-030] Compatibilidade com "duas últimas versões" pode ser algo perigoso

**Requisito afetado:** RNF

**Categoria:** Risco técnico

**Problema identificado**

O requisito define compatibilidade com as duas últimas versões estáveis de Chrome e Firefox, mas não define nenhum processo para acompanhar os lançamentos de novas versões ou quando os testes devem ser executada novamente ou se haverá algum tempo reservado para isso

**Por que isso é um risco**

A cada nova versão lançada pelos navegadores, pode havar mudanças com impacto na aplicação. Sem um processo definido, a equipe pode não saber quando precisa retestar, e a aplicação pode quebrar em uma versão nova e o cliente ver o problema antes do time de engenharia

**Sugestão de melhoria**

Adicionar um processo para acompanhar lançamentos de novas versões dos navegadores, definir quando os testes de compatibilidade devem ser reexecutados e quem é responsável por monitorar isso.

---

## [PRD-031] Ausência de requisitos de performance

**Requisito afetado:** RNF

**Categoria:** Requisito ausente

**Problema identificado**

Os requisitos não funcionais não definem nenhum critério de tempo de resposta para as operações da aplicação. Não há nenhuma definição de quanto tempo é aceitável para carregar a lista de tarefas, salvar uma tarefa ou receber a resposta da IA.

**Por que isso é um risco**

Sem critérios de performance definidos, não há como medir se a aplicação está dentro do esperado.

**Sugestão de melhoria**

Adicionar requisitos mínimos de performance. Exemplo: Listagem de tarefas deve carregar em até X segundos, operações de criar, concluir e excluir em até X segundos, etc

---

## [PRD-032] Ausência de requisitos de segurança

**Requisito afetado:** RNF

**Categoria:** Segurança

**Problema identificado**

Os requisitos não funcionais não mencionam nenhum critério de segurança, mesmo sendo uma aplicação que armazena API Keys de usuários e comunica com aplicações externas

**Por que isso é um risco**

Sem requisitos de segurança definidos, não há garantia de que a aplicação vai tratar os dados sensíveis dos usuários de forma adequada. Isso pode expor as chaves dos usuários a acessos indevidos e gerar problemas

**Sugestão de melhoria**

Adicionar requisitos mínimos de segurança como: comunicação via HTTPS, API Keys armazenadas de forma criptografada, ausência de dados sensíveis em logs, etc.