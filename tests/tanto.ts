import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Ona } from "../target/types/ona";

describe("ona", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Ona as Program<Ona>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
