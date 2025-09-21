import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'app-data.json');
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Nenhum dado salvo encontrado',
        data: null
      });
    }
    
    // Ler dados do arquivo
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    console.log('📂 Dados carregados do servidor:', filePath);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Dados carregados com sucesso',
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erro ao carregar dados:', error);
    return NextResponse.json({ 
      error: 'Erro ao carregar dados',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}