const competencias = ["Tecnologia", "Domínio", "Pessoas", "Processo", "Influência"];
const textos = {
    Tecnologia: ["Adota", "Orienta", "Evangeliza", "Ensina", "Cria"],
    Domínio: ["Aprende", "Apoia", "Referência", "Multiplica", "Define"],
    Pessoas: ["Aprende", "Apoia", "Mentora", "Coordena", "Gerência"],
    Processo: ["Segue", "Executa", "Desafia", "Aprimora", "Define"],
    Influência: ["Contexto", "Time", "Área", "Empresa", "Comunidade"]
};
let niveis = [0, 0, 0, 0, 0];

function validarFormulario() {
    const form = document.getElementById('competenciasForm');
    if (!form.checkValidity()) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return false;
    }
    atualizarCompetencias();
    return false;
}

function atualizarCompetencias() {
    competencias.forEach((competencia, index) => {
        const radios = document.getElementsByName(competencia);
        radios.forEach(radio => {
            if (radio.checked) {
                niveis[index] = parseInt(radio.value);
            }
        });
    });
    atualizarGrafico();
    atualizarResumo();
    gerarPerfil();
}

function atualizarResumo() {
    const colaborador = document.getElementById('colaborador').value;
    const cargo = document.getElementById('cargo').value;
    const resumoTexto = competencias.map((competencia, index) => {
        const nivel = niveis[index];
        return `<p><strong>${competencia}:</strong> ${textos[competencia][nivel - 1] || 'N/A'} (Nível ${nivel})</p>`;
    }).join('');
    document.getElementById('resumoTexto').innerHTML = `<p><strong>Colaborador:</strong> ${colaborador}</p><p><strong>Cargo:</strong> ${cargo}</p>${resumoTexto}`;
}

function gerarPDF() {
    const colaborador = document.getElementById('colaborador').value;
    const cargo = document.getElementById('cargo').value;
    const resumoTexto = document.getElementById('resumoTexto').innerHTML;
    const comentariosAdicionais = document.getElementById('comentariosAdicionais').value;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const lineHeight = 10;
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;
    let cursorY = 50;

    doc.setFontSize(18);
    doc.text('Resumo de Competências', 105, 20, null, null, 'center');
    doc.setFontSize(14);
    doc.text(`Colaborador: ${colaborador}`, 10, 30);
    doc.text(`Cargo: ${cargo}`, 10, 40);

    const canvas = document.getElementById('competenciasChart');
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 10, cursorY, 180, 160);
    cursorY += 170;

    doc.setFontSize(12);
    const resumoElement = document.createElement('div');
    resumoElement.innerHTML = resumoTexto;
    const paragraphs = Array.from(resumoElement.querySelectorAll('p'));

    paragraphs.forEach((p, index) => {
        const lines = doc.splitTextToSize(p.innerText, 180);
        lines.forEach(line => {
            if (cursorY + lineHeight > pageHeight - margin) {
                doc.addPage();
                cursorY = margin;
            }
            doc.text(line, 10, cursorY);
            cursorY += lineHeight;
        });
        cursorY += 5;
    });

    // doc.text(`Comentários Adicionais: ${comentariosAdicionais}`, 10, cursorY);

    doc.save(`Resumo ${colaborador}.pdf`);
}


function atualizarResumo() {
    const colaborador = document.getElementById('colaborador').value;
    const cargo = document.getElementById('cargo').value;
    const comentariosAdicionais = document.getElementById('comentariosAdicionais').value;
    const resumoTexto = competencias.map((competencia, index) => {
        const nivel = niveis[index];
        return `<p><strong>${competencia}:</strong> ${textos[competencia][nivel - 1] || 'N/A'} (Nível ${nivel})</p>`;
    }).join('');
    document.getElementById('resumoTexto').innerHTML = `
        <p><strong>Colaborador:</strong> ${colaborador}</p>
        <p><strong>Cargo:</strong> ${cargo}</p>
        ${resumoTexto}
        <p><strong>Comentários Adicionais:</strong> ${comentariosAdicionais}</p>
    `;
}


function atualizarGrafico() {
    const ctx = document.getElementById('competenciasChart').getContext('2d');
    if (window.competenciasChart) {
        window.competenciasChart.destroy();
    }
    window.competenciasChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: competencias,
            datasets: [{
                label: 'Nível de Competência',
                data: niveis,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 2
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            return `${competencias[index]}: ${textos[competencias[index]][context.raw - 1]}`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) { return Number.isInteger(value) ? value : ''; }
                    },
                    pointLabels: {
                        fontSize: 14
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('competenciasChart').getContext('2d');
    window.competenciasChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: competencias,
            datasets: [{
                label: 'Nível de Competência',
                data: niveis,
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 2
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            return `${competencias[index]}: ${textos[competencias[index]][context.raw - 1]}`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: function (value) { return Number.isInteger(value) ? value : ''; }
                    },
                    pointLabels: {
                        fontSize: 14
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });

    const perfilDiv = document.createElement('div');
    perfilDiv.id = 'perfil';
    document.querySelector('.container').appendChild(perfilDiv);

    const formElements = document.querySelectorAll('#competenciasForm input, #competenciasForm textarea');
    formElements.forEach(element => {
        element.addEventListener('input', checkFormValidity);
    });

    checkFormValidity();
});

function limparFormulario() {
    // Reseta o formulário
    document.getElementById('competenciasForm').reset();

    // Reseta os níveis
    niveis = [0, 0, 0, 0, 0];

    // Atualiza o gráfico e o resumo
    atualizarGrafico();
    document.getElementById('resumoTexto').innerHTML = '';

    // Limpa o campo de comentários adicionais
    document.getElementById('comentariosAdicionais').value = '';

    // Desabilita o link de download
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.style.pointerEvents = 'none';
    downloadLink.style.opacity = 0.5;
}

function checkFormValidity() {
    const form = document.getElementById('competenciasForm');
    const downloadLink = document.getElementById('downloadLink');
    const isValid = form.checkValidity();
    downloadLink.style.pointerEvents = isValid ? 'auto' : 'none';
    downloadLink.style.opacity = isValid ? 1 : 0.5;
}

async function chamarAI21(prompt) {
    try {
        const response = await fetch('https://api.ai21.com/studio/v1/j2-mid/complete', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer iKFDlkBuTGg1OISrEgk9gNOLDvOpnB1O`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                numResults: 1,
                maxTokens: 800,
                temperature: 0.5
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.completions[0].data.text.trim();
    } catch (error) {
        console.error('Error calling AI21 API:', error);
        return 'Erro ao gerar o perfil. Por favor, tente novamente.';
    }
}

async function gerarPerfil() {
    const colaborador = document.getElementById('colaborador').value;
    const cargo = document.getElementById('cargo').value;
    const comentariosAdicionais = document.getElementById('comentariosAdicionais').value;

    const competenciasSelecionadas = competencias.map((competencia, index) => {
        const radios = document.getElementsByName(competencia);
        let nivelSelecionado = 0;
        radios.forEach(radio => {
            if (radio.checked) {
                nivelSelecionado = parseInt(radio.value);
            }
        });
        return {
            competencia,
            nivel: nivelSelecionado,
            descricao: textos[competencia][nivelSelecionado - 1] || 'N/A'
        };
    });

    const prompt = `
        Nome do Colaborador: ${colaborador}
        Cargo: ${cargo}
        Competências e Níveis:
        ${competenciasSelecionadas.map(c => `${c.competencia}: ${c.descricao} Nível (${c.nivel})`).join('   ')}

        Comentario adicional: ${comentariosAdicionais}

        Critérios Avaliados:
        - Tecnologia: Habilidades técnicas, Aplicar as melhores práticas, Conhecimento nas linguagens e ferramentas utilizadas na empresa.
        - Domínio: Conhece o domínio de negócio da empresa, Conhecimento na diversidade de produtos da empresa.
        - Pessoas: Trabalho em equipe, Habilidades de comunicação e receber feedback, Compartilhar conhecimento, Gestão de conflitos.
        - Processo: Planejamento, Habilidades de estimativa, Fluxo de trabalho, Alinhamento estratégico.
        - Influência: Impacto da atuação no time, organização e comunidade, Relacionado com todos os demais pilares.

        Com base nessas informações, comentario adicional e critérios, gere uma descrição detalhada do perfil do colaborador destacando suas principais competências, áreas de especialização e possíveis áreas para desenvolvimento.
        Retorne sempre em pt-br e com no máximo 800 caracteres.
    `;

    const perfil = await chamarAI21(prompt);

    const perfilDividido = perfil.replace(/\s+/g, ' ').trim();

    document.getElementById('resumoTexto').innerHTML += `<p style="text-align: justify;"><strong>Perfil do Colaborador:</strong> ${perfilDividido}</p>`;
}
