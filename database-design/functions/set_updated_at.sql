BEGIN
  new.updated_at := now();
  RETURN new;
END;