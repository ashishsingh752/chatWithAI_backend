const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
      try {
        await requestHandler(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  };
  
  export { asyncHandler };
  
  // this is how we can use the custom asyncHandler 