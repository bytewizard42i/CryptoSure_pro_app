# CryptoSure backup exception

Clara, September 5, 2026. Reviewed revision: `ff2ca740c9882fa2c4aeeee339a37e3ebaacdcb7`.

Five pre-existing local deletions were observed: four advertisement images and one Windows zone-metadata sidecar. They were not staged or published. Their last committed contents remain in Git history. No CryptoSure application code was changed or tested in this pass.

Before a cleanup milestone, John should decide whether the missing artwork should be restored locally or explicitly retained as archived content. The global repository-preservation rule prevents publishing removals as part of a general backup request.
