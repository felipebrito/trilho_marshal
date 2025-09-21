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
        message: 'Nenhuma configuração encontrada para exportar',
        data: null
      });
    }
    
    // Ler dados do arquivo
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Adicionar informações de exportação
    const exportData = {
      ...data,
      exportInfo: {
        exportedAt: new Date().toISOString(),
        version: "1.0.0",
        application: "Trilho Marshal",
        exportedBy: "User"
      }
    };
    
    console.log('📤 Configuração exportada:', filePath);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Configuração exportada com sucesso',
      data: exportData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erro ao exportar configuração:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao exportar configuração',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
