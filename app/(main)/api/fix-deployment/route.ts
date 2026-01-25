import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { errorLogs, htmlContent, projectName } = await request.json();

    if (!errorLogs || !htmlContent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Error logs and HTML content are required',
        },
        { status: 400 },
      );
    }

    // Use AI to analyze the deployment error and suggest fixes
    const aiPrompt = `You are a deployment expert. Analyze this Vercel deployment error and suggest fixes for the HTML content.

Error Logs:
${errorLogs}

HTML Content:
${htmlContent.substring(0, 2000)}... (truncated)

Please provide:
1. A list of specific issues found (as an array of strings)
2. The corrected HTML content

Respond in JSON format:
{
  "fixes": ["fix description 1", "fix description 2"],
  "fixedHtml": "corrected HTML content"
}`;

    // Call AI API (using Anthropic Claude)
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

    if (!anthropicApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI API key not configured',
        },
        { status: 500 },
      );
    }

    const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: aiPrompt,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      console.error('AI API Error:', errorData);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to analyze error with AI',
        },
        { status: 500 },
      );
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.content[0].text;

    // Parse AI response
    let parsedResponse;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch =
        aiContent.match(/```json\n([\s\S]*?)\n```/) ||
        aiContent.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiContent;
      parsedResponse = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse AI suggestions',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      fixes: parsedResponse.fixes || [],
      fixedHtml: parsedResponse.fixedHtml || htmlContent,
    });
  } catch (error: any) {
    console.error('Fix deployment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}
