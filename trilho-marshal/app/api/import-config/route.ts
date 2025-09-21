import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validar se os dados contêm as propriedades necessárias
    const requiredFields = ['calibration', 'frames', 'bullets'];
    const missingFields = requiredFields.filter(field => !(field in data));
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`,
        data: null
      }, { status: 400 });
    }
    
    // Criar diretório de dados se não existir
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Criar backup da configuração atual
    const currentConfigPath = path.join(dataDir, 'app-data.json');
    if (fs.existsSync(currentConfigPath)) {
      const backupPath = path.join(dataDir, `app-data-backup-${Date.now()}.json`);
      fs.copyFileSync(currentConfigPath, backupPath);
      console.log('💾 Backup criado:', backupPath);
    }
    
    // Salvar nova configuração
    const newConfig = {
      ...data,
      importInfo: {
        importedAt: new Date().toISOString(),
        importedBy: "User"
      }
    };
    
    const filePath = path.join(dataDir, 'app-data.json');
    const jsonData = JSON.stringify(newConfig, null, 2);
    
    fs.writeFileSync(filePath, jsonData, 'utf8');
    
    console.log('📥 Configuração importada:', filePath);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Configuração importada com sucesso',
      filePath: filePath,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erro ao importar configuração:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao importar configuração',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
