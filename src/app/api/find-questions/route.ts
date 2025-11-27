import { NextResponse } from 'next/server';


import { authenticateWithLogin } from '../coa-report/route';



export async function GET() {
  const API_KEY = 'mb_8zJEoSQntOGOMWSzdvXUh+nUsLFXAHZjL65cH20XSnk=';
  const session = await authenticateWithLogin();
  try {
    console.log('🔍 Finding accessible questions...');
    
    // Get all questions accessible to this API key
    const response = await fetch('http://localhost:2650/api/card', {
      headers: {
        'X-Metabase-API-Key': API_KEY,
        'Content-Type': 'application/json',
      }
    });

    console.log('Questions list status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Cannot list questions:', errorText);
      return NextResponse.json({
        error: 'Cannot list questions',
        status: response.status,
        details: errorText
      });
    }

    const questions = await response.json();
    console.log('✅ Questions retrieved successfully');
    
    // Process the questions list
    const questionsList = questions.data || questions;
    console.log('Total questions found:', questionsList.length);
    
    // Look for COA-related questions
    const coaQuestions = questionsList.filter(q => 
      q.name.toLowerCase().includes('coa') || 
      q.name.toLowerCase().includes('account') ||
      q.name.toLowerCase().includes('chart')
    );
    
    console.log('COA-related questions:', coaQuestions.length);
    
    // Show all questions with IDs
    console.log('🔍 ALL AVAILABLE QUESTIONS:');
    questionsList.slice(0, 10).forEach(q => {
      console.log(`ID: ${q.id}, Name: "${q.name}", Table: ${q.table_id}`);
    });
    
    return NextResponse.json({
      success: true,
      message: 'Questions found successfully',
      summary: {
        totalQuestions: questionsList.length,
        coaQuestions: coaQuestions.length,
        question70Exists: questionsList.some(q => q.id === 70)
      },
      // First 20 questions with details
      questions: questionsList.slice(0, 20).map(q => ({
        id: q.id,
        name: q.name,
        collection_id: q.collection_id,
        table_id: q.table_id,
        database_id: q.database_id
      })),
      // COA-specific questions
      coaQuestions: coaQuestions.map(q => ({
        id: q.id,
        name: q.name,
        collection_id: q.collection_id
      }))
    });

  } catch (error) {
    console.error('❌ Error finding questions:', error);
    return NextResponse.json({
      error: 'Failed to find questions',
      message: error.message
    }, { status: 500 });
  }
}
