import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = 'mb_8zJEoSQntOGOMWSzdvXUh+nUsLFXAHZjL65cH20XSnk=';
  
  try {
    console.log('🔍 Checking Question 70 specifically...');
    
    // Check if question 70 exists and is accessible
    const questionResponse = await fetch('http://localhost:2650/api/card/70', {
      headers: {
        'X-Metabase-API-Key': API_KEY,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Question 70 metadata status:', questionResponse.status);
    
    if (questionResponse.ok) {
      const questionData = await questionResponse.json();
      console.log('✅ Question 70 accessible!');
      console.log('Name:', questionData.name);
      console.log('Collection:', questionData.collection_id);
      console.log('Creator:', questionData.creator?.email);
      
      return NextResponse.json({
        success: true,
        question: {
          id: questionData.id,
          name: questionData.name,
          collection_id: questionData.collection_id,
          database_id: questionData.database_id,
          table_id: questionData.table_id,
          can_read: true
        }
      });
      
    } else {
      const errorText = await questionResponse.text();
      console.log('❌ Question 70 not accessible:', errorText);
      
      return NextResponse.json({
        error: 'Question 70 not accessible',
        status: questionResponse.status,
        details: errorText
      });
    }

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check question',
      message: error.message
    });
  }
}
