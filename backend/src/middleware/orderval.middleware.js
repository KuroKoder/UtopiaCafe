exports.createOrderValidation = (req, res, next) => {
  const { name, detail_order, total_order, total_price } = req.body;
  if (name === undefined || name == "") {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "bad request",
      data: {
        original: req.body,
      },
      error: "Name field is required",
    });
  }
  if (detail_order === undefined || detail_order == "") {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "bad request",
      data: {
        original: req.body,
      },
      error: "Detail Order field is required",
    });
  }
  if (total_order === undefined || total_order == "") {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "bad request",
      data: {
        original: req.body,
      },
      error: "Total order field is required",
    });
  }
  if (total_order > 3) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "bad request",
      data: {
        original: req.body,
      },
      error: "Total Order cannot be more than 3",
    });
  }
  if (total_price === undefined || total_price == "") {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "bad request",
      data: {
        original: req.body,
      },
      error: "Total Price field is required",
    });
  }
  next();
};
