export const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (err) {
        const message = err.errors.map(e => e.message).join(", ");
        return res.status(400).json({ message, errors: err.errors });
    }
};
