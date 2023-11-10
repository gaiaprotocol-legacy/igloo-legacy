BEGIN
  IF old.read = false AND new.read = true THEN
    new.read_at := now();
  END IF;
  RETURN new;
END;
