import { Box, Button, HStack, Heading, Progress, Text, VStack, useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiDownload, FiFile, FiRotateCcw, FiUploadCloud } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { analyzeSample, type UploadProgress } from '../../shared/lib/api';
import { GlassCard } from '../../shared/ui/GlassCard';
import { RiskRing } from '../../shared/ui/RiskRing';
import { VerdictBadge } from '../../shared/ui/Badges';
import { COLORS, ROUTES } from '../../shared/constants';
import { formatBytes } from '../../shared/utils';
import type { Analysis } from '../../shared/types';

const stages = [
  ['hash', 'Вычисление хэшей'],
  ['static', 'Извлечение статических признаков'],
  ['dynamic', 'Sandbox-детонация'],
  ['ml', 'ML-классификация'],
] as const;

export function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(null);
  const toast = useToast();
  const mutation = useMutation<Analysis, Error, File>({
    mutationFn: (file) => analyzeSample(file, setProgress),
    onMutate: (file) => {
      setFileMeta({ name: file.name, size: file.size });
      toast({ title: 'Образец добавлен в mock-анализ', status: 'info', duration: 1600 });
    },
  });
  const start = (file?: File) => {
    if (!file) return;
    setProgress({ progress: 0, stage: 'hash', label: 'Образец поставлен в очередь анализа...' });
    mutation.mutate(file);
  };
  const reset = () => { mutation.reset(); setProgress(null); setFileMeta(null); };
  const result = mutation.data;

  return (
    <VStack align="stretch" spacing="16px">
      <Box><Text color={COLORS.textMuted} fontSize="11px" fontWeight="600" letterSpacing="0.1em">АНАЛИЗ</Text><Heading fontSize="24px">Загрузка образца</Heading><Text color={COLORS.textSecondary}>Frontend-only mock-анализ. Байты файла не читаются и не исполняются.</Text></Box>
      {!result && (
        <GlassCard
          as="button"
          p="24px"
          minH="320px"
          borderStyle="dashed"
          textAlign="center"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => { event.preventDefault(); start(event.dataTransfer.files[0]); }}
        >
          <input ref={inputRef} type="file" hidden onChange={(event) => start(event.target.files?.[0])} />
          <VStack spacing="14px">
            <FiUploadCloud size={54} color={COLORS.info} />
            <Heading size="md" fontWeight="500">Перетащите образец или выберите файл</Heading>
            <Text color={COLORS.textSecondary}>Подходит любой файл. SENTINEL использует только file.name и file.size для симуляции в рамках индивидуального проекта.</Text>
          </VStack>
        </GlassCard>
      )}
      {fileMeta && !result && (
        <GlassCard p="20px">
          <HStack mb="12px"><FiFile color={COLORS.info} /><Text fontWeight="500">{fileMeta.name}</Text><Text color={COLORS.textSecondary}>{formatBytes(fileMeta.size)}</Text></HStack>
          <Progress value={progress?.progress ?? 0} h="8px" borderRadius="sm" bg={COLORS.borderSubtle} colorScheme="cyan" />
          <Text mt="10px" color={COLORS.textSecondary}>{progress?.label}</Text>
          <VStack align="stretch" mt="16px">
            {stages.map(([key, label]) => {
              const done = (progress?.progress ?? 0) >= (key === 'hash' ? 25 : key === 'static' ? 55 : key === 'dynamic' ? 85 : 100);
              return <HStack key={key} color={done ? COLORS.safe : COLORS.textSecondary}><FiCheckCircle size={14} /><Text fontSize="13px">{label}</Text></HStack>;
            })}
          </VStack>
        </GlassCard>
      )}
      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <GlassCard p="24px">
            <VStack spacing="16px">
              <VerdictBadge verdict={result.verdict} />
              <RiskRing value={result.riskScore} size={150} />
              <Heading size="md" fontWeight="500">Вердикт: {result.verdict === 'benign' ? 'безопасный' : result.verdict === 'suspicious' ? 'подозрительный' : 'вредоносный'} · уверенность {result.confidence}%</Heading>
              <Text color={COLORS.textSecondary} maxW="760px" textAlign="center">{result.explanation}</Text>
              <HStack><Button as={Link} to={ROUTES.analysis(result.id)}>Открыть полный отчёт</Button><Button leftIcon={<FiRotateCcw />} onClick={reset}>Проанализировать другой</Button><Button leftIcon={<FiDownload />} onClick={() => window.print()}>Экспорт PDF</Button></HStack>
            </VStack>
          </GlassCard>
        </motion.div>
      )}
    </VStack>
  );
}
