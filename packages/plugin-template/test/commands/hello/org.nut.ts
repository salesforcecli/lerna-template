/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';
import { expect } from '@salesforce/command/lib/test';

let testSession: TestSession;

describe('hello:org NUTs', () => {
  before(async () => {
    /**
     * for writing/testing NUTs locally it's convenient to set TESTKIT_HUB_USERNAME to a locally auth'd DevHub
     * for remote testing (CI) the TESTKIT_AUTH_URL should be set (output of `sfdx force:org:display -u <DevHub> --verbose`)
     */
    testSession = await TestSession.create({
      /**
       * the data from the setup commands can be accessed via testSession.setup array
       * each setup command, if multiple, will be entries
       */
      setupCommands: [
        'sfdx force:org:create -f config/project-scratch-def.json --setdefaultusername --wait 10 --durationdays 1',
      ],
      /**
       * I'm just creating a simple sfdx project called 'test' you can have this point to a static repo with the options
       * see https://github.com/salesforcecli/plugin-user/blob/main/test/allCommands.nut.ts#L25 for an example
       */
      project: { name: 'test' },
    });
  });

  after(async () => {
    /**
     * Make sure to clean up after all the tests are done
     */
    await testSession?.clean();
  });

  describe('hello:org', () => {
    it('should print expected message ', () => {
      /**
       * NUTs are written like any other unit test
       * the execCmd method is the entry to calling a command
       */
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const res = execCmd('hello:org', { ensureExitCode: 0 }).shellOutput.stdout as string;
      expect(res).to.include('Hello world! This is org:');
      expect(res).to.include('and I will be around until');
    });

    it('should print expected message with the --force flag', () => {
      /**
       * Add an arguments or flags just like running a command from the command line
       */
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const res = execCmd('hello:org --force README.md').shellOutput.stdout as string;
      expect(res).to.include('Hello world! This is org:');
      expect(res).to.include('and I will be around until');
      expect(res).to.include('You input --force and a file: README.md');
    });

    it('should print expected message with the --force flag', () => {
      /**
       * We can cast the type here so that we have nice types for asserting
       */
      const res = execCmd<{ msg: string; orgId: string }>('hello:org --json').jsonOutput?.result;
      expect(res?.msg).to.include('Hello world! This is org:');
      expect(res?.msg).to.include('and I will be around until');
    });
  });
});
