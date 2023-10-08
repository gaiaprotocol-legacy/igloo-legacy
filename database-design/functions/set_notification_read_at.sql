BEGIN
  IF old.read_at = false AND new.read_at = true THEN
    new.read_at := now();
  END IF;
  RETURN new;
END;
