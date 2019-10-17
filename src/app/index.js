import Express from 'express';
import { PingRouter } from './route/index';

const app = Express();
const port = process.env.PORT;

app.use('/ping', PingRouter);

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})