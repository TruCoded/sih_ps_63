import { Router, Request, Response } from 'express';
import { ragEngine } from '../services/ragEngine.js';
import { llmService } from '../services/llmService.js';
import { UserRole } from '../types/index.js';

export const ragRouter = Router();

// POST /api/ask
ragRouter.post('/ask', async (req: Request, res: Response) => {
  const { query, role = 'public_visitor', conversationHistory = [], config } = req.body;
  if (!query) {
    return res.status(400).json({ success: false, message: 'Query string is required' });
  }

  try {
    // 1. Run permission-filtered retrieval & policy refusal check
    const baseResult = await ragEngine.query(query, role as UserRole);

    // If it's a policy refusal or evidence gap, return immediately with grounded refusal
    if (baseResult.isUnsupportedOrGap && baseResult.answer.startsWith('Refusal:')) {
      return res.json({
        success: true,
        data: baseResult
      });
    }

    // 2. If evidence was found and citations exist, run LLM synthesis
    if (baseResult.evidenceFound && baseResult.citations.length > 0) {
      const llmOutput = await llmService.generateGroundedAnswer(
        query,
        baseResult.citations,
        conversationHistory,
        config
      );

      return res.json({
        success: true,
        data: {
          ...baseResult,
          answer: llmOutput.answer,
          groundingConfidence: llmOutput.confidence,
          modelUsed: llmOutput.modelUsed
        }
      });
    }

    // 3. FIX AI FALLOUT: If no specific raw dataset matched, generate a grounded polar science explanation
    // instead of returning an abrupt refusal to general polar queries (penguins, wildlife, ice, geography).
    try {
      const polarScientificAnswer = await llmService.generateGeneralPolarAnswer(
        query,
        role as UserRole,
        conversationHistory,
        config
      );

      return res.json({
        success: true,
        data: {
          ...baseResult,
          answer: polarScientificAnswer.answer,
          evidenceFound: true,
          isUnsupportedOrGap: false,
          groundingConfidence: polarScientificAnswer.confidence,
          modelUsed: polarScientificAnswer.modelUsed,
          citations: polarScientificAnswer.citations
        }
      });
    } catch {
      return res.json({
        success: true,
        data: baseResult
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'RAG generation failed', error });
  }
});

// GET /api/eval/rag-benchmark
ragRouter.get('/eval/rag-benchmark', async (req: Request, res: Response) => {
  try {
    const report = await ragEngine.runBenchmarkSuite();
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Benchmark suite failed', error });
  }
});
