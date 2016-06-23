#IPFS Setup (local)

# Start Daemon
ipfs daemon

# Check for directory & files (bar, baz)

ipfs ls QmdcYvbv8FSBfbq1VVSfbjLokVaBYRLKHShpnXu3crd3Gm

# add new dir & file

  639  mkdir foo
  640  ls -l
  641  ipfs add -r foo