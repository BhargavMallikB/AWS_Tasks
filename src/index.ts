import { createInfra } from './infrastructure';
import { basicExample, s3Operations } from './functions/lambdaHandlers';

(async () => {
    // Step 1: Create infrastructure
    await createInfra();

    // Step 2: Run Lambda examples
    await basicExample();
    await s3Operations();
})();
