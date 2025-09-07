
-- 1) Adicionar novas colunas para período do evento
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS start_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS end_date   timestamp with time zone;

-- 2) Backfill: popular start_date e end_date a partir de event_date quando estiverem nulas
UPDATE public.events
SET
  start_date = COALESCE(start_date, event_date),
  end_date   = COALESCE(end_date, event_date)
WHERE start_date IS NULL OR end_date IS NULL;

-- 3) Tornar as novas colunas obrigatórias
ALTER TABLE public.events
  ALTER COLUMN start_date SET NOT NULL,
  ALTER COLUMN end_date   SET NOT NULL;

-- 4) Função de validação e sincronização do campo legado
CREATE OR REPLACE FUNCTION public.validate_and_sync_event_dates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Garantir presença
  IF NEW.start_date IS NULL OR NEW.end_date IS NULL THEN
    RAISE EXCEPTION 'start_date e end_date são obrigatórios';
  END IF;

  -- Validar ordem
  IF NEW.end_date < NEW.start_date THEN
    RAISE EXCEPTION 'end_date (%) não pode ser anterior a start_date (%)', NEW.end_date, NEW.start_date;
  END IF;

  -- Sincronizar campo legado enquanto migramos o frontend
  NEW.event_date := NEW.start_date;

  RETURN NEW;
END;
$function$;

-- 5) Trigger para validar/sincronizar datas em inserts e updates
DROP TRIGGER IF EXISTS trg_validate_and_sync_event_dates ON public.events;
CREATE TRIGGER trg_validate_and_sync_event_dates
BEFORE INSERT OR UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.validate_and_sync_event_dates();
