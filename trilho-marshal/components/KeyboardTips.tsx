'use client';

import React from 'react';

export default function KeyboardTips() {
  return (
    <div className="mt-4 text-xs text-gray-400">
      <p>💡 <strong>Teclas:</strong> C = Alternar modos | R = Reset | O/P = Navegar | T = Travar | U = UDP | S = Salvar no Servidor | B = Toggle Blur | X = Toggle Chromatic</p>
      <p>💡 <strong>Navegação:</strong> O/P = Movimento horizontal | Scroll trackpad = navegação horizontal</p>
      <p>💡 <strong>UDP:</strong> Envie valores 0-1 para porta 8888 (só em modo operação)</p>
      <p>💡 <strong>Persistência:</strong> S = Salvar no servidor | Botões para carregar/salvar manualmente</p>
      <p>💡 <strong>Modal:</strong> Clique em qualquer lugar da imagem para fechar o modal</p>
    </div>
  );
}