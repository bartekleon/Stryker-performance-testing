import { argv } from 'process';
import * as scenarios from './index';

switch (argv[2]) {
  case 'all':
    scenarios.scenarioAllInOneFile(Number(argv[3]));
    break;
  case 'uniform':
    scenarios.scenarioUniformlyDistributed(Number(argv[3]), Number(argv[4]));
    break;
  case 'random':
    scenarios.scenarioRandomlyDistributed(Number(argv[3]), Number(argv[4]));
    break;
}
