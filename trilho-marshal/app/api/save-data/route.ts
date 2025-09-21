import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Criar diretório de dados se não existir
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Salvar dados em arquivo JSON
    const filePath = path.join(dataDir, 'app-data.json');
    const jsonData = JSON.stringify(data, null, 2);
    
    fs.writeFileSync(filePath, jsonData, 'utf8');
    
    console.log('💾 Dados salvos no servidor:', filePath);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Dados salvos com sucesso',
      filePath: filePath,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erro ao salvar dados:', error);
    return NextResponse.json({ 
      error: 'Erro ao salvar dados',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}